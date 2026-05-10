const express = require('express');
const router = express.Router();

// Mock data for all endpoints
const SCORE_BREAKDOWNS = {
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
};

const FAIR_RECOMMENDATIONS = {
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
};

const CALLBACK_INSIGHTS = { "housing": 35, "visa": 22, "tuition": 18, "competitor": 12 };

const RECRUITMENT_CHANNEL_SPLIT = { "chatbot": 40, "web_form": 25, "campaign": 20, "agent": 15 };

const FUNNEL_METRICS = {
  "new_to_contacted": 62,
  "contacted_to_applied": 38,
  "applied_to_enrolled": 71
};

// GET /api/agent1/score/:country_id
router.get('/agent1/score/:country_id', (req, res) => {
  // TODO: replace with real DB query
  const { country_id } = req.params;
  const { major } = req.query;

  const scoreData = SCORE_BREAKDOWNS[country_id.toUpperCase()];
  if (!scoreData) {
    return res.status(404).json({ error: 'Country score breakdown not found' });
  }

  // Include major in response if provided
  const response = {
    ...scoreData,
    major: major || scoreData.major
  };

  res.json(response);
});

// GET /api/agent2/fairs/:country_id
router.get('/agent2/fairs/:country_id', (req, res) => {
  // TODO: replace with real DB query
  const { country_id } = req.params;

  const recommendations = FAIR_RECOMMENDATIONS[country_id.toUpperCase()];
  if (!recommendations) {
    return res.status(404).json({ error: 'Fair recommendations not found' });
  }

  res.json(recommendations);
});

// GET /api/admin/callback-insights
router.get('/admin/callback-insights', (req, res) => {
  // TODO: replace with real DB query
  res.json(CALLBACK_INSIGHTS);
});

// GET /api/admin/recruitment-channel-split
router.get('/admin/recruitment-channel-split', (req, res) => {
  // TODO: replace with real DB query
  res.json(RECRUITMENT_CHANNEL_SPLIT);
});

// GET /api/admin/funnel-metrics
router.get('/admin/funnel-metrics', (req, res) => {
  // TODO: replace with real DB query
  res.json(FUNNEL_METRICS);
});

module.exports = router;