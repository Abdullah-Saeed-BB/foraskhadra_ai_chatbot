from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from db.sessions import get_db
from db.models import Opportunity
from db.schemas import OpportunityResponse, OpportunityListResponse

router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"]
)

@router.get("/", response_model=OpportunityListResponse)
def get_opportunities(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    opportunities = db.query(Opportunity).offset(skip).limit(limit).all()
    total = db.query(Opportunity).count()
    return {
        "total": total,
        "items": opportunities,
        "skip": skip,
        "limit": limit
    }

@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity
