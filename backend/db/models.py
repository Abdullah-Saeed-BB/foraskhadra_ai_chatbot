from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

# Example Model
from datetime import datetime
from enum import Enum

from sqlalchemy import (
    String,
    Text,
    DateTime,
    Integer,
    Enum as SQLEnum,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class OpportunityStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    DRAFT = "draft"

class OpportunityCategory(str, Enum):
    JOB = "job"
    TRAINING = "training"
    FREELANCE = "freelance"
    VOLUNTEERING = "volunteering"
    SCHOLARSHIP = "scholarship"
    COMPETITION = "competition"
    HACKATHON = "hackathon"
    FELLOWSHIP = "fellowship"
    EVENT = "event"

class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[str] = mapped_column(
        String(8),
        primary_key=True,
    )

    title_en: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    title_ar: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    description_en: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    description_ar: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    category: Mapped[OpportunityCategory] = mapped_column(
        SQLEnum(OpportunityCategory),
        nullable=False,
        index=True,
    )

    organization_en: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    organization_ar: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    location_en: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    # Format: "country, city" or "remote"

    location_ar: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    # Format: "country, city" or "remote"

    requirements_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "requirement 1, requirement 2, requirement 3"

    requirements_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "requirement 1, requirement 2, requirement 3"

    benefits_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "benefit 1, benefit 2, benefit 3"

    benefits_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "benefit 1, benefit 2, benefit 3"

    application_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    tags_en: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "tag 1, tag 2, tag 3"

    tags_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "tag 1, tag 2, tag 3"

    published_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )