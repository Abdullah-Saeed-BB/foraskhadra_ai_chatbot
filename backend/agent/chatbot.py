from .agent import build_graph, AgentState
from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, AIMessage
from db.schemas import Message

def convert_messages_to_langchain_messages(messages: List[Message]) -> List[AIMessage | HumanMessage]:
    # Extract only the content from each message
    content_list = [
        HumanMessage(msg.content) if msg.type == "human" else AIMessage(msg.content)
    for msg in messages]
    
    # Join with newlines to preserve conversation flow
    return "\n".join(content_list)

class OpportunityChatbotAsync:
    """High-level wrapper around the compiled LangGraph agent."""

    def __init__(self) -> None:
        self.graph = build_graph()

    async def chat(self, messages: List[Message]) -> Dict[str, Any]:
        parsed_messages = convert_messages_to_langchain_messages(messages)
        user_input = parsed_messages[-1].content

        self.state: AgentState = {
            "messages": parsed_messages,
            "original_query": None,
            "user_query": user_input,
            "search_filters": {},
            "language": "",
            "needs_rag": False,
            "rag_ids": [],
            "original_final_response": None,
            "final_response": "",
            "original_suggestions": [],
            "suggestions": [],
        }
        self.state = await self.graph.ainvoke(self.state)
        lan = self.state.get("language", "en")
        return {
            "en_query": self.state.get("en_query", ""),
            "ar_query": self.state.get("ar_query", ""),
            "en_response": self.state.get("en_final_response", ""),
            "ar_response": self.state.get("ar_final_response", ""),
            "suggestions": self.state.get("en_suggestions", []) if lan == "en" else self.state.get("ar_suggestions", []),
            "language": lan,
            "used_rag": bool(self.state.get("needs_rag")),
            "rag_ids": self.state.get("rag_ids", []),
            "search_filters": self.state.get("search_filters", {}),
        }