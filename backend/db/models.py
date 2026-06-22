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
    INTERNSHIP = "internship"
    FREELANCE = "freelance"
    VOLUNTEERING = "volunteering"
    TRAINING = "training"
    SCHOLARSHIP = "scholarship"
    COMPETITION = "competition"
    HACKATHON = "hackathon"
    FELLOWSHIP = "fellowship"
    EVENT = "event"

class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    category: Mapped[OpportunityCategory] = mapped_column(
        SQLEnum(OpportunityCategory),
        nullable=False,
        index=True,
    )

    organization: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    # Format: "country, city" or "remote"

    requirements: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "requirement 1, requirement 2, requirement 3"

    benefits: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Save as "benefit 1, benefit 2, benefit 3"

    application_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    tags: Mapped[str | None] = mapped_column(
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