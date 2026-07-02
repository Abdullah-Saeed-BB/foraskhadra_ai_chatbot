from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from db.sessions import get_db
from db.models import Opportunity, OpportunityCategory
from db.schemas import OpportunityResponse, OpportunityListResponse

router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"]
)

def map_opportunity(opp: Opportunity, lang: str) -> dict:
    return {
        "id": opp.id,
        "title": opp.title_ar if lang == "ar" else opp.title_en,
        "description": opp.description_ar if lang == "ar" else opp.description_en,
        "category": opp.category,
        "organization": opp.organization_ar if lang == "ar" else opp.organization_en,
        "location": opp.location_ar if lang == "ar" else opp.location_en,
        "requirements": opp.requirements_ar if lang == "ar" else opp.requirements_en,
        "benefits": opp.benefits_ar if lang == "ar" else opp.benefits_en,
        "application_url": opp.application_url,
        "tags": opp.tags_ar if lang == "ar" else opp.tags_en,
        "published_at": opp.published_at,
        "expires_at": opp.expires_at,
        "created_at": opp.created_at,
        "updated_at": opp.updated_at
    }

@router.get("/", response_model=OpportunityListResponse)
def get_opportunities(
    lang: str = Query("en", description="Language for the response (en or ar)"),
    category: Optional[OpportunityCategory] = None,
    country: Optional[str] = None,
    city: Optional[str] = None,
    filter_search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)
    
    if category:
        query = query.filter(Opportunity.category == category)
        
    if filter_search:
        search_term = f"%{filter_search}%"
        query = query.filter(
            or_(
                Opportunity.location_en.ilike(search_term),
                Opportunity.location_ar.ilike(search_term)
            )
        )
        
    if country:
        search_term = f"%{country}%"
        query = query.filter(
            or_(
                Opportunity.location_en.ilike(search_term),
                Opportunity.location_ar.ilike(search_term)
            )
        )
        
    if city:
        search_term = f"%{city}%"
        query = query.filter(
            or_(
                Opportunity.location_en.ilike(search_term),
                Opportunity.location_ar.ilike(search_term)
            )
        )
        
    total = query.count()
    opportunities = query.offset(skip).limit(limit).all()
    
    items = [map_opportunity(opp, lang) for opp in opportunities]
    
    return {
        "total": total,
        "items": items,
        "skip": skip,
        "limit": limit
    }

@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(
    opportunity_id: str, 
    lang: str = Query("en", description="Language for the response (en or ar)"),
    db: Session = Depends(get_db)
):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return map_opportunity(opportunity, lang)
