from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Country(Base):
    __tablename__ = 'countries'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    iso_code = Column(String, unique=True)
    tier = Column(Integer) # 1, 2, 3
    internet_penetration = Column(Float)
    mobile_rate = Column(Float)
    gdp_per_capita = Column(Float)
    youth_population = Column(Float)
    outbound_mobility = Column(Float)
    youth_unemployment = Column(Float)
    english_proficiency = Column(Float)
    education_expenditure = Column(Float)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

class MajorScore(Base):
    __tablename__ = 'major_scores'
    id = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey('countries.id'))
    major_name = Column(String)
    score = Column(Float)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

class MarketingPlan(Base):
    __tablename__ = 'marketing_plans'
    id = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey('countries.id'))
    tier = Column(Integer)
    recommended_channels = Column(JSON)
    content_style = Column(String)
    language = Column(String)
    cultural_tone = Column(String)
    priority_score = Column(Float)
    assets = Column(JSON) # Store generated scripts/letters
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

class Lead(Base):
    __tablename__ = 'leads'
    id = Column(Integer, primary_key=True)
    full_name = Column(String)
    nationality = Column(String)
    country_of_residence = Column(String)
    desired_major = Column(String)
    degree_level = Column(String)
    start_date = Column(String)
    email = Column(String)
    phone = Column(String)
    status = Column(String, default='new') # new, contacted, applied, enrolled
    assigned_department = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Conversation(Base):
    __tablename__ = 'conversations'
    id = Column(Integer, primary_key=True)
    lead_id = Column(Integer, ForeignKey('leads.id'), nullable=True)
    messages = Column(JSON)
    status = Column(String, default='active')
    handoff_summary = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
