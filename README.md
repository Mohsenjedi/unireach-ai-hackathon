# UniReach AI 🌍

> **AI-Driven International Student Recruitment Platform**  
> Built for XAMK University — Hackathon 2025

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

[Live Demo](https://unireach-ai-demo.vercel.app) *(Update this link after deployment)*

---

## 📖 Overview

UniReach AI is a full-stack intelligence platform that helps XAMK University identify, reach, and convert international students at scale. It leverages an **AutoGen Multi-Agent Team** to solve the university budget crisis by automating international recruitment using a 'Local-First' AI strategy.

## 🤖 Agent Architecture

The backend orchestrates 4 specialized AutoGen agents:
1. **GlobalAnalyst**: Scrapes live World Bank/UNESCO data to calculate recruitment opportunity scores.
2. **HyperLocalStrategist**: Detects 'Low-Infrastructure' markets and generates Radio Scripts/SMS sequences.
3. **LeadSwitchboard**: Routes students based on sentiment analysis.
4. **AdmissionSherpa**: Handles complex Visa & Document checklists.

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohsenjedi/unireach-ai-hackathon.git
   cd unireach-ai-hackathon
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend Setup**
   ```bash
   cd unireach-ai
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
.
├── backend/            # FastAPI + AutoGen Agents
├── unireach-ai/       # Next.js Frontend
├── unireach.db        # SQLite Database
└── 1-prompt.md        # Original Project Specification
```

## 📄 License

MIT — Built for the XAMK University Hackathon 2025.
