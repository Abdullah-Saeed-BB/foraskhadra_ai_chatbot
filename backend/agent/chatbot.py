from .agent import build_graph, AgentState
from typing import Dict, Any
from langchain_core.messages import HumanMessage

class OpportunityChatbotAsync:
    """High-level wrapper around the compiled LangGraph agent."""

    def __init__(self) -> None:
        self.graph = build_graph()

    async def chat(self, user_input: str) -> Dict[str, Any]:
        self.state: AgentState = {
            "messages": [HumanMessage(content=user_input)],
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
        return {
            "response": self.state.get("final_response", ""),
            "suggestions": self.state.get("suggestions", []),
            "language": self.state.get("language", ""),
            "used_rag": bool(self.state.get("needs_rag")),
            "rag_ids": self.state.get("rag_ids", []),
            "search_filters": self.state.get("search_filters", {}),
        }