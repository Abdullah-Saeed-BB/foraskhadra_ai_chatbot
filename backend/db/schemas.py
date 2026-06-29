from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from typing import Optional, List
from datetime import datetime
from db.models import OpportunityCategory

class OpportunityBase(BaseModel):
    title: str
    description: str
    category: OpportunityCategory
    organization: str
    location: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    application_url: str
    tags: Optional[str] = None
    published_at: datetime
    expires_at: Optional[datetime] = None

class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class OpportunityListResponse(BaseModel):
    total: int
    items: List[OpportunityResponse]
    skip: int
    limit: int


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000,
                         description="User's chat message")


class DocumentData(BaseModel):
    id: str
    title: str
    description: str
    category: OpportunityCategory
    organization: str
    location: str
    requirements: str
    benefits: str
    application_url: str
    tags: str

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    language: str
    used_rag: bool
    # rag_ids: List[str]
    rag_data: List[DocumentData]
    search_filters: Dict[str, Any]

class StreamEvent(BaseModel):
    """Shape of each SSE event sent to the frontend."""
    event: str          # "node_start" | "node_done" | "done" | "error"
    node: Optional[str] = None
    data: Optional[Dict[str, Any]] = None