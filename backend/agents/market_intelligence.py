import os
import requests
from typing import List, Dict, Any
from ..database.db_manager import save_country_data, save_major_score

# World Bank Indicators
INDICATORS = {
    "GDP_PCAP": "NY.GDP.PCAP.CD",
    "YOUTH_POP": "SP.POP.1564.TO", # Using 15-64 as proxy if 15-24 is specific
    "INTERNET_PEN": "IT.NET.USER.ZS",
    "MOBILE_SUBS": "IT.CEL.SETS.P2",
    "EDU_EXPEND": "SE.XPD.TOTL.GD.ZS",
    "YOUTH_UNEMP": "SL.UEM.1524.ZS"
}

# Static data for demo if API fails
MOCK_COUNTRIES = [
    {"name": "Vietnam", "iso_code": "VN", "outbound_mobility": 85.0, "english_proficiency": 75.0},
    {"name": "India", "iso_code": "IN", "outbound_mobility": 90.0, "english_proficiency": 80.0},
    {"name": "Nigeria", "iso_code": "NG", "outbound_mobility": 70.0, "english_proficiency": 85.0},
    {"name": "Brazil", "iso_code": "BR", "outbound_mobility": 65.0, "english_proficiency": 60.0},
    {"name": "Germany", "iso_code": "DE", "outbound_mobility": 40.0, "english_proficiency": 95.0},
]

class MarketIntelligenceAgent:
    def __init__(self, db):
        self.db = db
        self.weights = {
            "outbound_mobility": 0.25,
            "gdp_per_capita": 0.20,
            "youth_population": 0.20,
            "youth_unemployment": 0.15,
            "english_proficiency": 0.10,
            "education_expenditure": 0.10
        }

    def fetch_world_bank_data(self, iso_code: str):
        # In a real app, this would hit https://api.worldbank.org/v2/country/{iso_code}/indicator/{indicator}?format=json
        # For the hackathon demo, we'll return structured data
        # We can simulate some variability
        import random
        return {
            "internet_penetration": random.uniform(10, 95),
            "mobile_rate": random.uniform(40, 120),
            "gdp_per_capita": random.uniform(500, 50000),
            "youth_population": random.uniform(1000000, 100000000),
            "youth_unemployment": random.uniform(5, 40),
            "education_expenditure": random.uniform(2, 8)
        }

    def score_country(self, country_data: Dict[str, Any], major: str):
        score = 0
        # Normalize and weight
        # Outbound Mobility (0-100)
        score += country_data.get('outbound_mobility', 50) * self.weights['outbound_mobility']
        
        # GDP per capita (Lower is often better for recruitment from developing nations)
        # We normalize GDP: 0-50k range
        gdp = country_data.get('gdp_per_capita', 10000)
        gdp_score = max(0, 100 - (gdp / 500)) 
        score += gdp_score * self.weights['gdp_per_capita']
        
        # Youth Population (Normalized to 100m)
        pop = country_data.get('youth_population', 10000000)
        pop_score = min(100, (pop / 1000000))
        score += pop_score * self.weights['youth_population']
        
        # Youth Unemployment (Higher is better for incentive to move)
        unemp = country_data.get('youth_unemployment', 15)
        unemp_score = min(100, unemp * 2)
        score += unemp_score * self.weights['youth_unemployment']
        
        # English Proficiency
        score += country_data.get('english_proficiency', 50) * self.weights['english_proficiency']
        
        # Education Expenditure
        exp = country_data.get('education_expenditure', 4)
        exp_score = min(100, exp * 12.5)
        score += exp_score * self.weights['education_expenditure']
        
        # Major adjustment
        if major == "Engineering" and pop > 20000000:
            score += 5
        elif major == "Medicine" and gdp > 15000:
            score += 5
            
        return min(100, score)

    def run_analysis(self, majors: List[str]):
        results = {}
        for major in majors:
            major_results = []
            for mock_c in MOCK_COUNTRIES:
                wb_data = self.fetch_world_bank_data(mock_c['iso_code'])
                full_data = {**mock_c, **wb_data}
                
                # Classify Tier
                internet = full_data['internet_penetration']
                if internet > 60:
                    tier = 1
                elif internet > 30:
                    tier = 2
                else:
                    tier = 3
                full_data['tier'] = tier
                
                # Save to DB
                country_obj = save_country_data(self.db, full_data)
                
                score = self.score_country(full_data, major)
                save_major_score(self.db, country_obj.id, major, score)
                
                major_results.append({
                    "country": country_obj.name,
                    "score": round(score, 1),
                    "tier": tier,
                    "indicators": {
                        "GDP": round(full_data['gdp_per_capita'], 0),
                        "Internet": round(full_data['internet_penetration'], 1),
                        "Mobility": full_data['outbound_mobility']
                    }
                })
            
            major_results.sort(key=lambda x: x['score'], reverse=True)
            results[major] = major_results
        
        return results
