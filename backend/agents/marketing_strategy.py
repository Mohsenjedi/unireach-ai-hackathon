import os
import autogen
from typing import Dict, Any
from ..database.db_manager import save_marketing_plan

HOFSTEDE_DATA = {
    "VN": {"individualism": 20, "power_distance": 70, "uncertainty_avoidance": 30},
    "IN": {"individualism": 48, "power_distance": 77, "uncertainty_avoidance": 40},
    "NG": {"individualism": 30, "power_distance": 80, "uncertainty_avoidance": 55},
    "BR": {"individualism": 38, "power_distance": 69, "uncertainty_avoidance": 76},
    "DE": {"individualism": 67, "power_distance": 35, "uncertainty_avoidance": 65},
}

DATAREPORTAL_MAPPING = {
    "VN": "TikTok, Facebook",
    "IN": "WhatsApp, YouTube, Instagram",
    "NG": "WhatsApp, Facebook",
    "BR": "Instagram, WhatsApp",
    "DE": "LinkedIn, Instagram",
}

class MarketingStrategyAgent:
    def __init__(self, db, llm_config):
        self.db = db
        self.llm_config = llm_config
        self.agent = autogen.AssistantAgent(
            name="StrategyGenerator",
            llm_config=llm_config,
            system_message="""You are a high-level marketing strategist and creative director for XAMK University.
            Your job is to generate specific marketing assets based on the country tier.
            Tier 1 (Digital): Social media ad copy and platform strategy.
            Tier 2 (Mixed): Hybrid plan with WhatsApp message templates.
            Tier 3 (Low-Infra): Radio scripts and embassy partnership letters.
            Use cultural context from Hofstede dimensions if provided."""
        )

    def generate_plan(self, country_obj):
        iso = country_obj.iso_code
        tier = country_obj.tier
        cultural = HOFSTEDE_DATA.get(iso, {"individualism": 50, "power_distance": 50})
        
        plan = {
            "tier": tier,
            "language": "English" if iso == "IN" or iso == "NG" else "Local",
            "cultural_tone": "Formal" if cultural['power_distance'] > 60 else "Casual",
            "recommended_channels": [],
            "content_style": "",
            "priority_score": 0.0
        }

        if tier == 1:
            plan["recommended_channels"] = DATAREPORTAL_MAPPING.get(iso, "Social Media").split(", ")
            plan["content_style"] = "Short-form video, influencer testimonials"
        elif tier == 2:
            plan["recommended_channels"] = ["WhatsApp", "Facebook", "SMS Fallback"]
            plan["content_style"] = "Direct messaging, localized infographics"
        else:
            plan["recommended_channels"] = ["Local Radio", "Embassy Outreach", "SMS"]
            plan["content_style"] = "Audio scripts, formal printed letters"

        # Use LLM to generate assets
        prompt = f"""Generate marketing assets for XAMK University recruitment in {country_obj.name}.
        Tier: {tier}
        Cultural Context: Individualism {cultural['individualism']}, Power Distance {cultural['power_distance']}.
        Primary Majors: Engineering, Business, Nursing.
        
        If Tier 1/2: Provide 3 social media ad headlines and 1 WhatsApp template.
        If Tier 3: Provide a 30-second radio script and a 1-paragraph embassy letter.
        """
        
        # Simple initiate_chat to get asset
        user_proxy = autogen.UserProxyAgent(name="Proxy", human_input_mode="NEVER", max_consecutive_auto_reply=0)
        chat_res = user_proxy.initiate_chat(self.agent, message=prompt, clear_history=True)
        
        plan["assets"] = chat_res.chat_history[-1]["content"]
        
        # Save to DB
        save_marketing_plan(self.db, country_obj.id, plan)
        
        return plan
