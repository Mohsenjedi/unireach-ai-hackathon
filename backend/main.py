from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Literal
import random
import os

app = FastAPI(title="UniReach AI Backend")

SCORE_BREAKDOWNS = {
    "CN": {
        "country": "China",
        "major": "Information Technology",
        "total_score": 94,
        "breakdown": {
            "youth_population": 26,
            "mobility": 18,
            "gdp": 22,
            "english": 12,
            "education_spending": 16,
        },
    },
    "IN": {
        "country": "India",
        "major": "Mechanical Engineering",
        "total_score": 89,
        "breakdown": {
            "youth_population": 27,
            "mobility": 20,
            "gdp": 10,
            "english": 18,
            "education_spending": 14,
        },
    },
    "PK": {
        "country": "Pakistan",
        "major": "Nursing",
        "total_score": 81,
        "breakdown": {
            "youth_population": 24,
            "mobility": 17,
            "gdp": 9,
            "english": 13,
            "education_spending": 18,
        },
    },
    "VN": {
        "country": "Vietnam",
        "major": "Information Technology",
        "total_score": 82,
        "breakdown": {
            "youth_population": 22,
            "mobility": 25,
            "gdp": 12,
            "english": 15,
            "education_spending": 8,
        },
    },
    "NG": {
        "country": "Nigeria",
        "major": "International Business",
        "total_score": 78,
        "breakdown": {
            "youth_population": 28,
            "mobility": 19,
            "gdp": 7,
            "english": 16,
            "education_spending": 8,
        },
    },
    "BR": {
        "country": "Brazil",
        "major": "Tourism",
        "total_score": 76,
        "breakdown": {
            "youth_population": 20,
            "mobility": 15,
            "gdp": 18,
            "english": 10,
            "education_spending": 13,
        },
    },
    "DE": {
        "country": "Germany",
        "major": "Mechanical Engineering",
        "total_score": 85,
        "breakdown": {
            "youth_population": 12,
            "mobility": 30,
            "gdp": 25,
            "english": 20,
            "education_spending": 18,
        },
    },
    "ID": {
        "country": "Indonesia",
        "major": "Maritime Management",
        "total_score": 73,
        "breakdown": {
            "youth_population": 25,
            "mobility": 12,
            "gdp": 8,
            "english": 14,
            "education_spending": 14,
        },
    },
    "BD": {
        "country": "Bangladesh",
        "major": "Nursing",
        "total_score": 70,
        "breakdown": {
            "youth_population": 30,
            "mobility": 10,
            "gdp": 5,
            "english": 12,
            "education_spending": 13,
        },
    },
}

FAIR_RECOMMENDATIONS = {
    "CN": [
        {"type": "Education Fair", "name": "Beijing Global Study Expo", "priority": "High", "reason": "Large concentration of STEM-focused families exploring overseas options."},
        {"type": "School Visit", "name": "Shanghai International High School Circuit", "priority": "Medium", "reason": "Strong counselor networks can drive qualified undergraduate inquiries."},
        {"type": "Embassy Seminar", "name": "Nordic Study Pathways Briefing", "priority": "Experimental", "reason": "Useful for building credibility around Finland as a study destination."},
        {"type": "Diaspora Engagement", "name": "Chinese Alumni Ambassador Meetup", "priority": "Medium", "reason": "Peer stories improve trust for family decision-making."},
        {"type": "Digital-only Campaign", "name": "Douyin + WeChat IT Funnel", "priority": "High", "reason": "Digital channels can scale awareness quickly among urban prospects."},
    ],
    "IN": [
        {"type": "Education Fair", "name": "Bangalore Future Engineers Fair", "priority": "High", "reason": "Engineering demand and outbound student interest are consistently strong."},
        {"type": "School Visit", "name": "Delhi NCR IB School Tour", "priority": "High", "reason": "Top schools provide direct access to internationally minded applicants."},
        {"type": "Embassy Seminar", "name": "Study in Finland Information Session", "priority": "Medium", "reason": "Embassy-backed messaging helps differentiate Finland from competing destinations."},
        {"type": "Diaspora Engagement", "name": "Indian Alumni Career Stories Night", "priority": "Medium", "reason": "Alumni credibility supports conversion for parents and students."},
        {"type": "Digital-only Campaign", "name": "YouTube + Search Scholarship Push", "priority": "High", "reason": "Search-driven intent is strong for scholarship-led recruitment."},
    ],
    "VN": [
        {"type": "Education Fair", "name": "Hanoi Education Expo", "priority": "High", "reason": "Strong outbound mobility from Vietnam makes this a high-yield fair."},
        {"type": "School Visit", "name": "Ho Chi Minh STEM School Visits", "priority": "Medium", "reason": "School counselor engagement can surface qualified Information Technology prospects."},
        {"type": "Embassy Seminar", "name": "Finland Higher Education Seminar", "priority": "Medium", "reason": "Embassy-led trust building is effective for new destination awareness."},
        {"type": "Diaspora Engagement", "name": "Vietnamese Student Ambassador Roundtable", "priority": "Experimental", "reason": "Small community events can improve authenticity and referral potential."},
        {"type": "Digital-only Campaign", "name": "Zalo + Facebook Lead Campaign", "priority": "High", "reason": "Vietnamese students respond well to mobile-first outreach at scale."},
    ],
    "NG": [
        {"type": "Education Fair", "name": "Lagos International Study Fair", "priority": "High", "reason": "Nigeria has strong outbound intent and a large youth cohort."},
        {"type": "School Visit", "name": "Abuja Sixth Form Outreach", "priority": "Medium", "reason": "Direct visits help explain scholarships and application requirements."},
        {"type": "Embassy Seminar", "name": "Northern Europe Study Briefing", "priority": "Experimental", "reason": "Awareness events can test receptiveness to Finland as an option."},
        {"type": "Diaspora Engagement", "name": "Nigerian Alumni Mentorship Session", "priority": "High", "reason": "Diaspora-led trust signals can significantly boost conversion confidence."},
        {"type": "Digital-only Campaign", "name": "WhatsApp + Instagram Prospect Funnel", "priority": "High", "reason": "Mobile messaging remains an efficient follow-up channel for leads."},
    ],
    "PK": [
        {"type": "Education Fair", "name": "Karachi Global Study Forum", "priority": "Medium", "reason": "Students are actively comparing affordable overseas education pathways."},
        {"type": "School Visit", "name": "Lahore Science School Roadshow", "priority": "High", "reason": "Nursing and health-focused school visits create targeted interest."},
        {"type": "Embassy Seminar", "name": "Scholarships in Finland Session", "priority": "Medium", "reason": "Scholarship clarity can remove hesitation among strong applicants."},
        {"type": "Diaspora Engagement", "name": "Pakistani Parents Information Circle", "priority": "Experimental", "reason": "Family-centered sessions help address trust and safety concerns."},
        {"type": "Digital-only Campaign", "name": "Urdu Social Video Campaign", "priority": "High", "reason": "Localized digital messaging improves reach and comprehension."},
    ],
    "BR": [
        {"type": "Education Fair", "name": "Sao Paulo International Education Week", "priority": "High", "reason": "Brazil has strong urban demand for tourism and hospitality study abroad."},
        {"type": "School Visit", "name": "Rio Private School Counselor Tour", "priority": "Medium", "reason": "Counselor partnerships improve credibility with premium student segments."},
        {"type": "Embassy Seminar", "name": "Nordic Study Destination Showcase", "priority": "Experimental", "reason": "Useful for testing broader awareness of Finland in the market."},
        {"type": "Diaspora Engagement", "name": "Brazilian Student Community Webinar", "priority": "Medium", "reason": "Community proof helps reduce uncertainty about relocation."},
        {"type": "Digital-only Campaign", "name": "Instagram + WhatsApp Lead Nurture", "priority": "High", "reason": "Social-first engagement aligns well with channel behavior in Brazil."},
    ],
    "DE": [
        {"type": "Education Fair", "name": "Berlin Engineering Expo", "priority": "Medium", "reason": "Germany has strong engineering traditions and outbound mobility."},
        {"type": "School Visit", "name": "Munich Technical School Visits", "priority": "High", "reason": "Direct engagement with engineering-focused schools."},
        {"type": "Embassy Seminar", "name": "Finland Tech Education Seminar", "priority": "Medium", "reason": "Highlighting Finland's engineering strengths."},
        {"type": "Diaspora Engagement", "name": "German Alumni Engineering Network", "priority": "High", "reason": "Strong diaspora support for technical fields."},
        {"type": "Digital-only Campaign", "name": "LinkedIn + Engineering Forums", "priority": "High", "reason": "Professional networks are key for engineering recruitment."},
    ],
    "ID": [
        {"type": "Education Fair", "name": "Jakarta Maritime Fair", "priority": "High", "reason": "Indonesia's maritime industry drives demand for management programs."},
        {"type": "School Visit", "name": "Surabaya Maritime Academy Outreach", "priority": "Medium", "reason": "Targeted visits to maritime education institutions."},
        {"type": "Embassy Seminar", "name": "Nordic Maritime Studies Briefing", "priority": "Experimental", "reason": "Building awareness of Finland's maritime expertise."},
        {"type": "Diaspora Engagement", "name": "Indonesian Maritime Alumni Meetup", "priority": "Medium", "reason": "Community events for career advancement."},
        {"type": "Digital-only Campaign", "name": "Facebook + WhatsApp Maritime Campaign", "priority": "High", "reason": "Digital outreach effective in Indonesia."},
    ],
    "BD": [
        {"type": "Education Fair", "name": "Dhaka Health Education Expo", "priority": "High", "reason": "Bangladesh has growing demand for nursing education abroad."},
        {"type": "School Visit", "name": "Chittagong Medical School Circuit", "priority": "Medium", "reason": "Direct access to health-focused students."},
        {"type": "Embassy Seminar", "name": "Finland Nursing Pathways Seminar", "priority": "Medium", "reason": "Showcasing Finland's healthcare system."},
        {"type": "Diaspora Engagement", "name": "Bangladeshi Healthcare Alumni Network", "priority": "High", "reason": "Strong community support for health professions."},
        {"type": "Digital-only Campaign", "name": "YouTube + Social Media Nursing Funnel", "priority": "High", "reason": "Video content drives engagement for health studies."},
    ],
}

CALLBACK_INSIGHTS = {
    "housing": 35,
    "visa": 22,
    "tuition": 18,
    "competitor": 12,
}

cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# --- In-Memory Database ---
class MockDB:
    def __init__(self):
        self.countries = [
            {"id": "IN", "name": "India", "gdpPerCapita": 2200, "internetUsers": 43, "english": 55},
            {"id": "VN", "name": "Vietnam", "gdpPerCapita": 3700, "internetUsers": 70, "english": 52},
            {"id": "NG", "name": "Nigeria", "gdpPerCapita": 2100, "internetUsers": 36, "english": 62},
            {"id": "BR", "name": "Brazil", "gdpPerCapita": 7500, "internetUsers": 81, "english": 48},
            {"id": "PK", "name": "Pakistan", "gdpPerCapita": 1500, "internetUsers": 30, "english": 50},
            {"id": "CN", "name": "China", "gdpPerCapita": 10500, "internetUsers": 70, "english": 30},
            {"id": "DE", "name": "Germany", "gdpPerCapita": 42000, "internetUsers": 92, "english": 70},
            {"id": "ID", "name": "Indonesia", "gdpPerCapita": 4200, "internetUsers": 54, "english": 40},
            {"id": "BD", "name": "Bangladesh", "gdpPerCapita": 2200, "internetUsers": 25, "english": 35},
        ]
        self.leads = [
            {"id": 1, "full_name": "Amara Okafor", "nationality": "Nigeria", "desired_major": "International Business", "status": "Routing to African Dept", "color": "bg-green-100 text-green-800"},
            {"id": 2, "full_name": "Li Wei", "nationality": "Vietnam", "desired_major": "Information Technology", "status": "Verification Pending", "color": "bg-yellow-100 text-yellow-800"},
        ]
        self.plans = {}

db = MockDB()

# --- Models ---
class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    nationality: str = Field(min_length=2, max_length=80)
    desired_major: str = Field(min_length=2, max_length=120)
    degree_level: Literal["Bachelor", "Master", "PhD", "Exchange"]
    start_date: str = Field(min_length=2, max_length=40)
    email: str = Field(min_length=5, max_length=120, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    phone: str = Field(min_length=3, max_length=40, pattern=r"^[+\d][\d\s()-]{2,39}$")

class QueryRequest(BaseModel):
    message: str

class AnalyzeRequest(BaseModel):
    majors: List[str] = Field(min_length=1)

# --- Endpoints ---

@app.get("/")
async def health():
    return {"status": "ok", "message": "UniReach AI Backend is operational"}

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    # Simulated Multi-Agent Analysis
    major = request.majors[0]
    results = []
    for c in db.countries:
        score = random.randint(70, 95)
        results.append({
            "country": c["name"],
            "iso": c["id"],
            "score": score,
            "tier": 1 if c["english"] > 50 else 2,
            "indicators": {
                "GDP": c["gdpPerCapita"],
                "Internet": c["internetUsers"],
                "English": c["english"]
            }
        })
    results.sort(key=lambda x: x["score"], reverse=True)
    return {major: results}

@app.get("/marketing-plan/{iso_code}")
async def get_plan(iso_code: str):
    # If not exists, generate a mock one
    if iso_code not in db.plans:
        country = next((c for c in db.countries if c["id"] == iso_code), None)
        if not country:
            # Create a mock entry for new ISO codes
            country = {"id": iso_code, "name": iso_code, "english": 50}
        
        db.plans[iso_code] = {
            "tier": 1 if country["english"] > 50 else 2,
            "cultural_tone": "Professional" if country["english"] > 50 else "Direct",
            "recommended_channels": ["Facebook", "Instagram", "WhatsApp"] if country["id"] != "IN" else ["LinkedIn", "YouTube"],
            "content_style": "High-energy, success-focused",
            "language": "English",
            "assets": f"Targeted ad for {country['name']}: 'Unlock your future at XAMK. Finnish excellence meets global ambition.'"
        }
    return db.plans[iso_code]

@app.get("/api/agent1/score/{country_id}")
async def get_country_score_breakdown(country_id: str):
    score = SCORE_BREAKDOWNS.get(country_id.upper())
    if not score:
        raise HTTPException(status_code=404, detail="Country score breakdown not found")
    return score

@app.get("/api/agent2/fairs/{country_id}")
async def get_fair_recommendations(country_id: str):
    recommendations = FAIR_RECOMMENDATIONS.get(country_id.upper())
    if not recommendations:
        raise HTTPException(status_code=404, detail="Fair recommendations not found")
    return recommendations

@app.get("/api/admin/callback-insights")
async def get_callback_insights():
    return CALLBACK_INSIGHTS

@app.post("/leads")
async def create_lead(lead_data: LeadCreate):
    new_lead = lead_data.model_dump()
    new_lead["id"] = len(db.leads) + 1
    new_lead["status"] = "Routing to Admissions"
    new_lead["color"] = "bg-blue-100 text-blue-800"
    db.leads.insert(0, new_lead) # Most recent first
    return {"status": "success", "lead": new_lead}

@app.get("/leads")
async def list_leads():
    return db.leads

@app.post("/concierge/chat")
async def concierge_chat(request: QueryRequest):
    # Simulated Concierge Response
    responses = [
        "XAMK offers over 40 degree programs in English. Which field interests you most?",
        "Application for 2025 starts in January. You can apply via Studyinfo.fi.",
        "Finland is known for having the highest quality of life. XAMK has campuses in Mikkeli, Kotka, Savonlinna, and Kouvola.",
        "Tuition fees range from 7,000 to 10,000 EUR per year, but scholarships are available."
    ]
    return {"response": random.choice(responses)}

@app.get("/dashboard/summary")
async def get_summary():
    return {
        "total_leads": len(db.leads),
        "countries_scanned": len(db.countries),
        "leads_by_status": {
            "new": len(db.leads),
            "contacted": 0,
            "applied": 0,
            "enrolled": 0
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
