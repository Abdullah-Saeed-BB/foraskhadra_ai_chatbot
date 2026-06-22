from fastapi import APIRouter, Depends
from db.schemas import AgentRequest, AgentResponse
from services.agent_service import handle_agent_query
from routers.auth import verify_token, rate_limit

router = APIRouter(
    prefix="/agent",
    tags=["agent"],
    dependencies=[Depends(verify_token), Depends(rate_limit)]
)

@router.post("/query", response_model=AgentResponse)
async def query_agent(request: AgentRequest):
    """
    Endpoint to process a query using the AI agent.
    Validates input with Pydantic (AgentRequest), authenticates, and applies rate limiting via dependencies.
    """
    # Dispatch to service layer
    return handle_agent_query(request)
