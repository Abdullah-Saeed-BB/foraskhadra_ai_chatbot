import json
import re

from enum import Enum
from typing import Any, Dict, List, TypedDict, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from lingua import Language, LanguageDetectorBuilder

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chat_models import init_chat_model
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import END, START, StateGraph
from sqlalchemy import create_engine, text

from .config import *
from db.models import OpportunityCategory

# -----------------------------------
# Defintions
# -----------------------------------


class AgentState(TypedDict, total=False):
    messages: List[AIMessage | HumanMessage]          # conversation messages
    ar_query: Optional[str]
    en_query: str              # raw user input
    search_filters: Dict[str, Any]
    language: str
    needs_rag: bool              # router decision
    rag_ids: List[str]           # IDs returned by ChromaDB
    ar_final_response: Optional[str]        # final answer shown to the user
    en_final_response: str       # final answer shown to the user
    ar_suggestions: Optional[List[str]]       # follow-up prompts from light-LLM
    en_suggestions: List[str]       # follow-up prompts from light-LLM

class SearchFilters(BaseModel):
    """Structured metadata filters extracted from a user query"""
    location: Optional[str] = Field(
        None, 
        description="The specific city or country mentioned in the query. Leave None if no city or country is mentioned. Map inputs like 'UAE' to 'United Arab Emirates', 'KSA' to 'Saudi Arabia', etc."
    )
    category: Optional[OpportunityCategory] = Field(
        None, 
        description="The specific category mentioned in the query. Leave None if no category is mentioned."
    )

class SuggestionsTranslation(BaseModel):
    suggestions: List[str] = Field(
        description="The translated suggestions in the same order as the input."
    )

# -----------------------------------
# Componenst
# -----------------------------------

def get_main_llm(temp=.1) -> init_chat_model:
    return init_chat_model(
        model=MAIN_LLM_MODEL,
        model_provider="groq",
        temperature=temp,
        api_key=GROQ_API_KEY
    )

def get_light_llm(temp=.5) -> init_chat_model:
    return init_chat_model(
        model=LIGHT_LLM_MODEL,
        model_provider="groq",
        temperature=temp,
        api_key=GROQ_API_KEY
    )

def get_translate_llm(temp=0) -> init_chat_model:
    return init_chat_model(
        model=LIGHT_LLM_MODEL,
        model_provider="groq",
        temperature=temp,
        api_key=GROQ_API_KEY
    )

def get_embeddings() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(
        model=str("./models/embedding_function")
    )


def get_chroma() -> Chroma:
    return Chroma(
        collection_name=CHROMA_COLLECTION,
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_PERSIST_DIR,
    )


def get_db_engine():
    return create_engine(DATABASE_URL, future=True)


# -----------------------------------
# Nodes
# -----------------------------------

def language_detector_node(state: AgentState) -> Dict[str, Any]:
    """Detect the language of the prompt, and translate it to English if it's not English"""
    query = state["en_query"]

    detector = LanguageDetectorBuilder.from_languages(Language.ENGLISH, Language.ARABIC).build()

    detect_result = detector.detect_language_of(query)

    language = "ar" if detect_result == Language.ARABIC else "en"

    if language == "ar":
        trans_llm = get_translate_llm()

        system_prompt = (
            "Translate the Arabic user prompt to English prompt. "
            "Just write the translation don't add anything that are not exist on the Arabic prompt like 'translate: ...'."
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Arabic Text: {ar_prompt}")
        ])
        chain = prompt | trans_llm

        res = chain.invoke({"ar_prompt": query})

        return {"language": language, "ar_query": query, "en_query": res.content}
    return {"language": language, "en_query": query}

def router_node(state: AgentState) -> Dict[str, Any]:
    """Decide whether the user is looking for opportunities (RAG path)."""
    query = state["en_query"].lower()

    # Fast keyword shortcut — saves an LLM call for obvious cases
    opportunity_keywords = {
        "opportunity", "opportunities", "job", "jobs", "position", "positions",
        "vacancy", "vacancies", "career", "careers", "opening", "openings",
        "hiring", "recruit", "role", "roles", "work with you", "join",
    }
    if any(kw in query for kw in opportunity_keywords):
        return {"needs_rag": True}

    # LLM-based intent classification for ambiguous queries
    light_llm = get_light_llm()
    resp = light_llm.invoke([
        SystemMessage(
            content=(
                "You are an intent classifier. Respond with ONLY 'yes' if the user "
                "is looking for any kind of opportunities or interest of something "
                "like job, course, event, training, internship, scholarship, "
                "volunteering, hackathon and etc. Otherwise respond with ONLY 'no'."
            )
        ),
        HumanMessage(content=state["en_query"]),
    ])
    needs_rag = "yes" in resp.content.lower()
    return {"needs_rag": needs_rag}

def query_analyzer_node(state: AgentState) -> Dict[str, Any]:
    """Analyze the user query to extract structured metadata filters."""
    # Use your preferred LLM
    llm = get_light_llm(temp=0)
    # Bind the schema to guarantee structured JSON output
    structured_llm = llm.with_structured_output(SearchFilters)
    
    system_prompt = (
        "You are an expert search assistant. Extract metadata filters from the user query. "
        "If a specific country, city, or category (e.g. Internship, volunteering, etc) is requested, extract it. If it is not mentioned, leave it blank."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{en_query}")
    ])
    
    # Run the chain
    chain = prompt | structured_llm
    extracted: SearchFilters = chain.invoke({"en_query": state["en_query"]})
    
    # Convert Pydantic object to a clean dict, dropping None values
    filters = {k: v for k, v in extracted.model_dump().items() if v is not None}
    
    return {"search_filters": filters}

def rag_retriever_node(state: AgentState) -> Dict[str, Any]:
    """Query ChromaDB and return the IDs of the most relevant opportunities."""
    chroma = get_chroma()

    filters = state.get("search_filters", {})

    chroma_filter = []
    if "location" in filters:
        chroma_filter.append(
            {"$or": [
                {"country": {"$contains": filters["location"].lower()}},
                {"city": filters["location"].lower()},
            ]}
        )
    if "category" in filters:
        chroma_filter.append(
            {"category": {"$eq": filters["category"].lower()}}
        )
    
    if len(chroma_filter) > 1 :
        chroma_filter = {"$and": chroma_filter}
    elif len(chroma_filter) == 1:
        chroma_filter = chroma_filter[0]
    else:
        chroma_filter = {} 

    docs = chroma.similarity_search(
        state["en_query"],
        k=RAG_TOP_K,
        filter=chroma_filter
    )

    # Prefer an explicit `id` stored in metadata; fall back to the doc id
    rag_ids: List[str] = []
    for d in docs:
        doc_id = (d.metadata or {}).get("id") or d.id
        if doc_id:
            rag_ids.append(str(doc_id))

    return {"rag_ids": rag_ids}

def db_formatter_node(state: AgentState) -> Dict[str, Any]:
    """
    Format the retrieved opportunities into a warm, natural conversational response based on data and user prompt.
    Write always "<|DATA|>" act as data section on the response, so I can replace it with the real data.
    """
    llm = get_main_llm(temp=.4)

    rag_ids = state.get("rag_ids") or []
    query = state.get("en_query")

    if not rag_ids:
        light_llm = get_light_llm(temp=.4)

        fallback_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant. The user is looking for opportunities, but our database has zero matches. "
                       "Politely inform them that we don't have listings for that specific request right now, and invite them to try another location or category."),
            ("human", "{en_query}")
        ])
        chain = fallback_prompt | light_llm
        response = chain.invoke({"en_query": query})
        return {"en_final_response": response.content}

    main_llm = get_main_llm(temp=.4)

    placeholders = ", ".join(f":p{i}" for i in range(len(rag_ids)))
    params = {f"p{i}": rid for i, rid in enumerate(rag_ids)}
    sql = text(f"\
        SELECT id, title_en, organization_en, tags_en, benefits_en\
        FROM opportunities WHERE id IN ({placeholders})")
    engine = get_db_engine()
    with engine.connect() as conn:
        result = conn.execute(sql, params)
        rows = result.mappings().fetchall()

    formatted_context = ""
    for i, row in enumerate(rows):
        if len(rows) > 3:
            formatted_context += f"Opportunity {i+1}\n - Title: {row['title_en']}\n - Tags: {row['tags_en']}\n\n"
        else:
            formatted_context += f"Opportunity {i+1}\n - Title: {row['title_en']} by {row['organization_en']}\n - Tags: {row['tags_en']}\n - Benefits: {row['benefits_en']}\n\n"

    system_message = SystemMessage(content=(
        "You are a friendly, professional assistant helping users find career and educational opportunities. "
        "Review the retrieved opportunities provided below and answer the user's request in a warm, fluid, human-like paragraph structure. "
        "Do not print a bulleted markdown table or a dry list. Blend the titles and durations naturally into sentences (e.g., 'There are internships in Jeddah, such as the Financial Analysis Internship...'). "
        "Write always \"<|DATA|>\" where the real data section will show up, so I replace is with real data later. " 
        "Keep the tone encouraging, conversational, and directly responsive to their query."
    ))

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message.content),
        ("human", "User Query: {en_query}\n\nAvailable Data:\n{context}")
    ])

    chain = prompt | main_llm
    response = chain.invoke({
        "en_query": query,
        "context": formatted_context
    })

    return {"en_final_response": response.content}

def main_llm_node(state: AgentState) -> Dict[str, Any]:
    """Fallback path: let the main LLM answer the user directly."""
    main_llm = get_main_llm()
    resp = main_llm.invoke([
        SystemMessage(
            content=(
                "You are a helpful assistant for the organization. "
                "Answer the user clearly, concisely, and in a friendly tone."
            )
        ),
        HumanMessage(content=state["en_query"]),
    ])
    return {"en_final_response": resp.content}

def suggestion_generator_node(state: AgentState) -> Dict[str, Any]:
    """
    Final step: pass the latest output to a light-LLM
    to produce a list of follow-up suggestion prompts.
    """
    light_llm = get_light_llm()
    resp = light_llm.invoke([
        SystemMessage(
            content=(
                "Given the user's question and the assistant's answer, "
                "generate exactly 3 short follow-up questions the user might be interested in. "
                "Return ONLY a JSON array of strings, e.g. [\"q1\", \"q2\", \"q3\"]."
            )
        ),
        HumanMessage(
            content=(
                f"User asked: {state['en_query'].replace("<|DATA|>", "").replace("<|data|>", "")}\n\n"
                f"Assistant answered: {state.get('en_response', '')}"
            )
        ),
    ])

    suggestions = _parse_json_array(resp.content)
    return {"en_suggestions": suggestions}

def _parse_json_array(text: str) -> List[str]:
    """Robustly extract a JSON array of strings from LLM output."""
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
    except json.JSONDecodeError:
        pass
    # Fallback: pull anything that looks like "..."
    return re.findall(r'"([^"\n]+)"', text)

def translator_node(state: AgentState) -> Dict[str, any]:
    """Translate the final response to Arabic if user's language is not English"""
    en_response = state["en_final_response"]

    trans_llm = get_translate_llm()
    system_prompt = (
        "Translate the response text from English to Arabic. "
        "Do not add anything are not exist on the output text, like 'translation: ...'. "
    )

    lst_fresponse = en_response.split("<|DATA|>")
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "English Output: {en_response}")
    ])
    for i in range(len(lst_fresponse)):
        fres = lst_fresponse[i]
        if len(fres) > 2:
            chain = prompt | trans_llm
            response = chain.invoke({
                "en_response": fres
            })
            lst_fresponse[i] = response.content
        else:
            lst_fresponse[i] = ""
    ar_response = "<|DATA|>".join(lst_fresponse)


    trans_llm = get_translate_llm().with_structured_output(
        SuggestionsTranslation
    )
    en_suggestions = state["en_suggestions"]

    system_prompt = (
        "Translate the suggestions from English to Arabic. "
        "Do not add anything are not exist on the output text, like 'translation: ...'. "
        "Keep the same number of suggestions and keep the same order. "
        "Do not merge, remove, or create new suggestions."
    )
    chain = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "English suggestions: {en_suggestions}"),
    ]) | trans_llm

    result = chain.invoke({
        "en_suggestions": en_suggestions
    })

    ar_suggestions = result.suggestions

    print("\nTrans Suggestions:", ar_suggestions)

    return {
        "en_final_response": en_response,
        "ar_final_response": ar_response,
        "en_suggestions": en_suggestions,
        "ar_suggestions": ar_suggestions,
    }


# ----------------------------
# Graph builder
# ----------------------------

def build_graph() -> Any:
    graph = StateGraph(AgentState)

    # Register nodes
    graph.add_node("language_detector", language_detector_node)
    graph.add_node("router", router_node)
    graph.add_node("query_analyzer", query_analyzer_node)
    graph.add_node("rag_retriever", rag_retriever_node)
    graph.add_node("db_formatter", db_formatter_node)
    graph.add_node("main_llm", main_llm_node)
    graph.add_node("suggestion_generator", suggestion_generator_node)
    graph.add_node("translator", translator_node)

    # Edges
    graph.add_edge(START, "language_detector")
    graph.add_edge("language_detector", "router")

    def rag_route(state: AgentState) -> str:
        return "query_analyzer" if state.get("needs_rag") else "main_llm"

    def translate_route(state: AgentState) -> str:
        return "translator" if state["language"] == "ar" else END

    graph.add_conditional_edges(
        "router",
        rag_route,
        {"query_analyzer": "query_analyzer", "main_llm": "main_llm"},
    )

    graph.add_conditional_edges(
        "suggestion_generator",
        translate_route,
        {"translator": "translator", END: END},
    )

    graph.add_edge("query_analyzer", "rag_retriever")
    graph.add_edge("rag_retriever", "db_formatter")
    graph.add_edge("db_formatter", "suggestion_generator")
    graph.add_edge("main_llm", "suggestion_generator")
    graph.add_edge("suggestion_generator", END)

    app = graph.compile()

    return app
