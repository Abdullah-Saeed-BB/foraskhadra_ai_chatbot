from .agent import build_graph, AgentState
from typing import Dict, Any
from langchain_core.messages import HumanMessage

class OpportunityChatbot:
    """High-level wrapper around the compiled LangGraph agent."""

    def __init__(self) -> None:
        self.graph = build_graph()
        self.result = {}

    def chat(self, user_input: str) -> Dict[str, Any]:
        initial_state: AgentState = {
            "messages": [HumanMessage(content=user_input)],
            "original_query": None,
            "user_query": user_input,
            "search_filters": {},
            "needs_rag": False,
            "rag_ids": [],
            "original_final_response": None,
            "final_response": "",
            "original_suggestions": [],
            "suggestions": [],
        }
        self.result = self.graph.invoke(initial_state)
        return {
            "response": self.result.get("final_response", ""),
            "suggestions": self.result.get("suggestions", []),
            "used_rag": bool(self.result.get("needs_rag")),
        }