from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.schemas import ChatResponse, ChatRequest
from db.sessions import get_db
from db.models import Opportunity
from agent.chatbot import OpportunityChatbotAsync
from routers.auth import verify_token, rate_limit

router = APIRouter(
    prefix="/agent",
    tags=["agent"],
    # dependencies=[Depends(verify_token), Depends(rate_limit)]
)

@router.post("/query", response_model=ChatResponse)
async def query_agent(request: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    """
    Endpoint to process a query using the AI agent.
    Validates input with Pydantic (AgentRequest), authenticates, and applies rate limiting via dependencies.
    """

    try:
        agent = OpportunityChatbotAsync()
        result = await agent.chat(request.message)

        opportunities = []
        if result["used_rag"] and result["rag_ids"]:
            rows = db.query(Opportunity).where(Opportunity.id.in_(result["rag_ids"])).all()
            isEn = result["language"] == "en"
            opportunities = [{
                "id": row.id,
                "title": row.title_en if isEn else row.title_ar,
                "description": row.description_en if isEn else row.description_ar,
                "category": row.category.value,
                "organization": row.organization_en if isEn else row.organization_ar,
                "location": row.organization_en if isEn else row.organization_ar,
                "requirements": row.requirements_en if isEn else row.requirements_ar,
                "benefits": row.benefits_en if isEn else row.benefits_ar,
                "application_url": row.application_url,
                "tags": row.tags_en if isEn else row.tags_ar,
            } for row in rows]

        return ChatResponse(
            response=result["response"],
            suggestions=result["suggestions"],
            language=result["language"],
            used_rag=result["used_rag"],
            rag_data=opportunities,
            # rag_ids=result["rag_ids"],
            search_filters=result["search_filters"],
        )
    except Exception as e:
        # Log the real error server-side; don't leak internals
        print("Error occurs on Query Agent:", e)
        raise HTTPException(status_code=500, detail="Chat processing failed") from e
