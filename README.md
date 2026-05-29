# 🌆 City Pulse

A real-time city analytics platform that aggregates weather, air quality, and event data into a single Pulse Score (0–100), helping users understand how vibrant, comfortable, and active a city feels at any moment.

Built with FastAPI, PostgreSQL, React, machine learning forecasting, and AI-generated city mood summaries.

---

## 🚀 Live Demo

**Frontend:** https://project-s9n4g.vercel.app

**Backend API:** https://city-pulse-production-5856.up.railway.app

---

## ✨ Features

- Real-time weather monitoring
- Air quality tracking and AQI analysis
- Event density monitoring
- Custom Pulse Score algorithm
- AI-generated city mood summaries
- Historical trend analysis
- 24-hour forecasting using Facebook Prophet
- Dynamic city search
- Automated data collection every 15 minutes
- Interactive dashboard and map visualizations

---

## 🏗️ Data Flow

```text
Weather API ─┐
             │
Air Quality ─┼──► Data Pipeline ─► Pulse Score Engine ─► PostgreSQL
             │                                      │
Events API ──┘                                      │
                                                     ▼
                                         FastAPI Backend
                                                     │
                          ┌──────────────────────────┼──────────────────────────┐
                          ▼                          ▼                          ▼
                  AI Summaries              Historical Trends          ML Forecasts
                                                     │
                                                     ▼
                                            React Dashboard
```

---

## 🛠 Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- APScheduler

### Frontend

- React
- Axios
- Recharts
- Leaflet

### AI & Machine Learning

- Groq API (Llama 3)
- Facebook Prophet

### Deployment

- Railway
- Vercel

---

## 📊 Pulse Score Algorithm

City Pulse converts raw environmental signals into a score from **0–100**.

### Weather Score

Based on:

- Temperature comfort
- Humidity
- Wind speed
- Weather conditions

### Air Quality Score

Based on:

- AQI levels
- PM2.5 concentrations
- Pollution severity

### Event Score

Based on:

- Event count
- City activity level

### Final Formula

```text
Pulse Score =
(Weather Score × Weight)
+ (Air Quality Score × Weight)
+ (Event Score × Weight)
```

Scores are normalized and clamped between 0 and 100.

---

## 🤖 AI Mood Summaries

City Pulse uses Groq's Llama 3 model to generate natural-language descriptions of a city's current atmosphere.

Example:

> "Lucknow feels lively this evening with pleasant weather, moderate air quality, and several ongoing events contributing to a vibrant city vibe."

To reduce latency and API usage, summaries are cached for 30 minutes.

---

## 📈 Forecasting

The platform uses Facebook Prophet to forecast Pulse Scores for the next 24 hours.

Features:

- Daily seasonality detection
- Confidence intervals
- Historical trend learning
- Forecast caching for improved performance

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/dashboard` | All tracked cities |
| GET | `/api/pulse/{city}` | Latest city data |
| GET | `/api/search/{city}` | Search and save a city |
| GET | `/api/trend/{city}` | Historical trends |
| GET | `/api/history/{city}` | Weather and AQI history |
| GET | `/api/daily/{city}` | Daily summary |
| GET | `/api/comparison` | City rankings |
| GET | `/api/forecast/{city}` | 24-hour forecast |
| GET | `/api/forecast` | Forecasts for all cities |

---

## 🗄 Database Schema

### Core Tables

```sql
cities
weather_snapshots
air_quality_snapshots
events_snapshots
pulse_scores
```

All records are timestamped and stored for historical analysis and forecasting.

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/jagzgotspark/City-Pulse.git
cd City-Pulse
```

### Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
OPENWEATHER_API_KEY=your_key
PREDICTHQ_TOKEN=your_token
GROQ_API_KEY=your_key
DATABASE_URL=your_database_url
```

### Start Backend

```bash
uvicorn src.api.main:app --reload
```

### Start Scheduler

```bash
python3 -m src.scheduler
```

---

## 🎯 Engineering Challenges Solved

- Designed a weighted scoring algorithm that models real-world city livability
- Built an automated multi-source data ingestion pipeline
- Stored and queried time-series analytics data using PostgreSQL
- Reduced AI response latency through caching
- Implemented machine learning forecasting on continuously collected city data
- Enabled on-demand city discovery and persistence

---

## 📌 Future Improvements

- Neighborhood-level analytics
- Additional environmental indicators
- User personalization
- Real-time alerting system
- Advanced forecasting models

---

## 👩‍💻 Author

**Jagriti Singh**

Built as a full-stack data engineering, analytics, and machine learning project focused on transforming raw city data into meaningful real-time insights.