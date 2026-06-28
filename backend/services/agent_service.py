from db.schemas import AgentRequest, AgentResponse
from agent.chatbot import process_query

def handle_agent_query(request: AgentRequest) -> AgentResponse:
    """
    Business logic for processing an agent query.
    This service orchestrates data formatting and calling the underlying AI engine.
    """
    # Call the AI agent engine
    answer = process_query(request.query)
    
    return AgentResponse(answer=answer)
