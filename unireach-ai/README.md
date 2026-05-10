# UniReach AI 🌍

> **AI-Driven International Student Recruitment Platform**  
> Built for XAMK University — Hackathon 2025

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

---

## Overview

UniReach AI is a full-stack intelligence platform that helps XAMK University identify, reach, and convert international students at scale. It combines real-time market data, AI-powered routing, multilingual communication, and automated campaign management into a single unified dashboard.

## ✨ Features

| Module | Description |
|---|---|
| **Market Intelligence** | Analyzes 142+ countries by GDP, student demand, and programme fit. Animated KPI cards + ranked country table. |
| **Marketing Strategy** | Country-tier system (Tier 1–3) with tailored channel recommendations. Click any country to view its full plan. |
| **Lead Capture** | Multilingual student intake form with auto-language detection, GDPR compliance, and FastAPI backend. |
| **Admissions Chatbot** | Full-page AI chat interface with quick-reply chips, language selector, and agent handoff panel. |
| **Admin Dashboard** | Pipeline funnel (New→Contacted→Applied→Enrolled), nationality bar chart, active campaign management. |

## 🖥️ Tech Stack

**Frontend**
- Next.js 15 (App Router, Turbopack)
- TypeScript 5
- Syne + DM Sans (Google Fonts)
- Vanilla CSS Design System (no Tailwind)

**Backend**
- FastAPI (Python)
- World Bank API integration
- Groq / Claude AI (agent layer)

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- npm or pnpm

### Frontend

```bash
cd unireach-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

> The frontend gracefully falls back to mock data if the backend is offline.

## 📁 Project Structure

```
unireach-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Shell: sidebar + topbar + routing
│   │   ├── layout.tsx
│   │   └── globals.css        # Full CSS design system
│   ├── components/
│   │   ├── ScreenMarketIntelligence.tsx
│   │   ├── ScreenMarketingStrategy.tsx
│   │   ├── ScreenLeadCapture.tsx
│   │   ├── ScreenAdmissionsChat.tsx
│   │   └── ScreenAdminDashboard.tsx
│   ├── context/
│   │   └── AgentCommunicationContext.tsx
│   └── lib/
│       └── agents/
backend/
├── main.py
└── requirements.txt
```

## 🎨 Design System

- **Page background:** `#f4f5f7`
- **Sidebar:** `#0a1628` (deep navy)
- **Cards:** white, `border-radius: 12px`, `0.5px` border — no shadows, no gradients
- **Primary accent:** `#3b82f6` (blue)
- **Fonts:** Syne 700 (headings) + DM Sans 400/500 (body)

## 📄 License

MIT — Built for the XAMK University Hackathon 2025.
