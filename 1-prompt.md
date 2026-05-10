Build a high-impact, full-stack application called "UniReach AI" using React (Vite), FastAPI, and an AutoGen Multi-Agent Team. 

GOAL: Solve the university budget crisis by automating international recruitment using a 'Local-First' AI strategy.

AGENT ARCHITECTURE (AutoGen + Antigravity Tools):
Create a 'Mission Control' script in `backend/main.py` orchestrating 4 specialized AutoGen agents:
1. 'GlobalAnalyst': Uses the Antigravity Browser Tool to scrape live World Bank/UNESCO data. It calculates a 'Recruitment Opportunity Score' based on youth population and GDP trends.
2. 'HyperLocalStrategist': (JUDGE-WINNER FEATURE) Detects if a country is 'Low-Infrastructure'. If so, it autonomously generates: 
   - A 30-sec Radio Script in the local dialect (e.g., Swahili, Hausa).
   - An SMS-campaign sequence for 2G/3G phones.
   - A formal 'Partnership Proposal' PDF for local Embassies.
3. 'LeadSwitchboard': A multilingual routing agent that uses sentiment analysis on student inquiries to prioritize 'High-Intent' leads in the PostgreSQL database.
4. 'AdmissionSherpa': A 24/7 conversational bot that handles the complex 'Visa & Document' checklist for each specific country's requirements.

APP FEATURES FOR 100/100 SCORE:
- UI: Build a 'Live Agent War Room' dashboard in React. Use framer-motion for a high-end feel.
- Artifacts: Show a side-by-side view of 'Digital Ads' vs 'Offline Radio Scripts' to prove market adaptability.
- Integration: Setup .env for OPENAI_API_KEY and a dummy DATABASE_URL.
- Documentation: Generate a 'Sustainability Report' automatically that shows how much CO2/Budget is saved by replacing physical recruitment travel with AI.

Set up the project structure, install all dependencies (autogen-agentchat, fastapi, sqlalchemy, uvicorn), and provide a 'Demo Mode' script that populates the DB with sample data for Nigeria, India, and Brazil.