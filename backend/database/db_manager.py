from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Country, MajorScore, MarketingPlan, Lead, Conversation
import os

DATABASE_URL = "sqlite:///./unireach.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions for agents
def save_country_data(db, data: dict):
    country = db.query(Country).filter(Country.iso_code == data['iso_code']).first()
    if not country:
        country = Country(**data)
        db.add(country)
    else:
        for key, value in data.items():
            setattr(country, key, value)
    db.commit()
    db.refresh(country)
    return country

def save_major_score(db, country_id: int, major_name: str, score: float):
    major_score = db.query(MajorScore).filter(
        MajorScore.country_id == country_id, 
        MajorScore.major_name == major_name
    ).first()
    if not major_score:
        major_score = MajorScore(country_id=country_id, major_name=major_name, score=score)
        db.add(major_score)
    else:
        major_score.score = score
    db.commit()
    return major_score

def save_marketing_plan(db, country_id: int, plan_data: dict):
    plan = db.query(MarketingPlan).filter(MarketingPlan.country_id == country_id).first()
    if not plan:
        plan = MarketingPlan(country_id=country_id, **plan_data)
        db.add(plan)
    else:
        for key, value in plan_data.items():
            setattr(plan, key, value)
    db.commit()
    return plan

def save_lead(db, lead_data: dict):
    lead = Lead(**lead_data)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

def update_lead_status(db, lead_id: int, status: str):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if lead:
        lead.status = status
        db.commit()
    return lead

def save_conversation(db, messages: list, lead_id: int = None, handoff_summary: str = None):
    conv = Conversation(lead_id=lead_id, messages=messages, handoff_summary=handoff_summary)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv
