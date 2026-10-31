# 🛡️ DISASTERHUB — AI Disaster Management & Emergency Operations Platform

<p align="center">
  <img src="public/favicon.svg" width="90" height="90" alt="DisasterHub Logo" />
</p>

<p align="center">
  <strong>Next-Generation AI Command Center for Real-Time Catastrophe Telemetry, Geospatial Analytics, and Emergency Resource Allocation.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Mapbox_GL-v3.9-000000?logo=mapbox&logoColor=white" alt="Mapbox" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL_%2B_PostGIS-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

---

## 📌 Repository
🔗 **[https://github.com/Paaaarth1909/AI-Disaster-Management-and-Recovery-Platform](https://github.com/Paaaarth1909/AI-Disaster-Management-and-Recovery-Platform)**

---

## 📖 Overview

**DISASTERHUB** is an enterprise-grade AI-powered Emergency Operations Center (EOC) platform designed to tackle critical disaster response challenges. It unifies **satellite and ground telemetry, Google Gemini 1.5 neural intelligence, dual 2D/3D geospatial visualization, and real-time logistics tracking** into an actionable operational command dashboard.

Engineered from the ground up for high-stakes emergency dispatch, disaster severity forecasting, and citizen safety coordination.

---

## ✨ Key Features

### 1. 🗺️ Dual Geospatial Tactical Feeds
* **2D Tactical Map Feed (Mapbox GL JS v3):**
  * Real-time vector layers with 3D terrain pitch and smooth zoom.
  * Multi-basemap support: **Cyber Dark**, **Orbital Recon (Satellite)**, **Tactical Night**, and **Grid Streets**.
  * Dynamic hazard overlays: Evacuation polygons, severe flood zones, and tactical extraction corridors.
* **3D Holo-Globe Recon Mode (WebGL / COBE):**
  * Planetary spherical Earth projection with real-time geo-referenced catastrophe markers.
  * Interactive mouse drag-rotation and instant **Orbital Jump to Sector** navigation.
  * Color-coded global hazard classification (Earthquakes, Floods, Cyclones, Wildfires).

### 2. 🤖 Gemini AI Copilot (Live Telemetry Context-Aware)
* Direct REST API integration with Google's **Gemini 1.5 Flash** models supporting modern authorization key standards (`x-goog-api-key`).
* **Automated Executive SitRep Generator:** Synthesizes ongoing catastrophes, affected citizen counts, and operational DEFCON threat levels.
* **Logistics Shortage Analytics:** Identifies critical deficits in trauma care beds, potable water rations, and emergency shelters.
* **Fail-Safe Telemetry Engine:** Integrated context-aware local intelligence fallback ensures zero operational downtime even during connectivity loss.

### 3. 🧠 AI Diagnostics & Misinformation Hub
* **Severity & Resource Forecasting:** Computes immediate operational directives, perimeter cordons, and predicts 24-hour supply requirements based on exposed population.
* **Civic Verification & Truth Assessment:** Debunks circulating rumors, analyzes viral media credibility percentages, and issues verification directives to prevent mass panic.

### 4. 📦 Emergency Logistics & Resource Stockpiling
* Real-time inventory tracking across distributed supply depots (trauma beds, rations, Zodiac rescue rafts, mobile purifiers).
* Live status lifecycle tracking: `available` ➔ `reserved` ➔ `in-transit` ➔ `deployed`.

### 5. 🚨 Multi-Channel Alert & Siren Broadcast System
* Common Alerting Protocol (CAP) compliant emergency broadcast dispatch.
* Multi-channel delivery targets: **Emergency Sirens**, **Cellular Broadcasts**, and **Public Web Feeds**.

### 6. 👤 Interactive Role-Based Operational Access (RBAC)
* Switch clearance modes seamlessly in real-time:
  * 🛡️ **EOC Admin** (`Commander Ops` — Level 5 All-Access)
  * 🚒 **Tactical Field Lead** (`Tactical Unit Alpha` — Level 3 First Responder)
  * 👤 **Civilian Defense** (`Public Portal` — Level 1 Community Monitor)

---

## 🛠️ Tech Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 18.3, TypeScript 5.5, Vite 5.4 |
| **Styling & UI** | Tailwind CSS, Lucide React Icons, PostCSS |
| **State Management** | Zustand (Global Reactive Store) |
| **2D GIS Mapping** | Mapbox GL JS v3.9, React Map GL |
| **3D Planetary Globe** | COBE (WebGL Hardware Accelerated) |
| **Data Analytics** | Chart.js 4.4, React-Chartjs-2 |
| **AI & Neural Inference** | Google Gemini 1.5 Flash (via native REST interface) |
| **Database & Realtime** | Supabase, PostgreSQL 15 + PostGIS Extension |
| **Date & Time Utilities** | date-fns |

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Paaaarth1909/AI-Disaster-Management-and-Recovery-Platform.git
cd AI-Disaster-Management-and-Recovery-Platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash

# Mapbox Public Access Token
VITE_MAPBOX_TOKEN=your_mapbox_public_token_here

# Supabase PostgreSQL & Realtime
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Start the development server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 📁 Project Architecture

```
AI-Disaster-Management-and-Recovery-Platform/
├── public/
│   └── favicon.svg           # Emergency Command Radar Shield Favicon
├── src/
│   ├── components/
│   │   ├── AIAnalysis.tsx    # Predictive Diagnostics & Misinformation Hub
│   │   ├── AIChat.tsx        # Gemini 1.5 AI Copilot Terminal
│   │   ├── AlertModal.tsx    # Multi-Channel Emergency Siren Broadcast
│   │   ├── Analytics.tsx     # Chart.js Real-Time Telemetry Dashboard
│   │   ├── Dashboard.tsx     # Central Command Operations Center
│   │   ├── Dock.tsx          # Floating Tactical Navigation Dock
│   │   ├── Globe.tsx         # 3D WebGL Planetary Holo-Globe
│   │   ├── Map.tsx           # Mapbox v3 2D Vector Map Engine
│   │   ├── Navbar.tsx        # Header HUD & Operational Role Switcher
│   │   ├── ReportIncident.tsx# Citizen Incident Crowdsourcing Portal
│   │   └── ResourceModal.tsx # Emergency Stockpile Management
│   ├── lib/
│   │   ├── database.types.ts # TypeScript Schema Definitions
│   │   ├── gemini.ts         # Dual-Tier Gemini 1.5 & Tactical Engine
│   │   └── supabase.ts       # Supabase Client & Realtime Sync
│   ├── store/
│   │   └── disaster.ts       # Central Zustand State Machine
│   ├── App.tsx               # Root Application Component
│   ├── index.css             # Tailwind Directives & Cybernetic Design
│   └── main.tsx              # Application Entry Point
├── supabase/
│   └── migrations/           # PostGIS Spatial Database Migrations
└── package.json
```

---

## 👨‍💻 Author & Architect

**Parthsaarthie Sharma**  
*Full-Stack Engineer & AI Systems Developer*

* 🔗 **GitHub:** [@Paaaarth1909](https://github.com/Paaaarth1909)
* 💼 **Project Repository:** [AI-Disaster-Management-and-Recovery-Platform](https://github.com/Paaaarth1909/AI-Disaster-Management-and-Recovery-Platform)

---

## 📄 License
This project is licensed under the **MIT License** — feel free to use and adapt it for humanitarian and emergency response initiatives.
