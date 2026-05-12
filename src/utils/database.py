import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def init_db():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS weather_snapshots (
                id SERIAL PRIMARY KEY,
                city VARCHAR(100) NOT NULL,
                timestamp TIMESTAMPTZ NOT NULL,
                temperature FLOAT,
                feels_like FLOAT,
                humidity INTEGER,
                condition VARCHAR(50),
                description VARCHAR(100),
                wind_speed FLOAT,
                visibility INTEGER,
                aqi INTEGER,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        """))
        conn.commit()
        print("Database initialised")

def save_snapshot(data: dict):
    with engine.connect() as conn:
        conn.execute(text("""
            INSERT INTO weather_snapshots
                (city, timestamp, temperature, feels_like, humidity,
                 condition, description, wind_speed, visibility, aqi)
            VALUES
                (:city, :timestamp, :temperature, :feels_like, :humidity,
                 :condition, :description, :wind_speed, :visibility, :aqi)
        """), data)
        conn.commit()
        print(f"Saved snapshot for {data['city']}")

def get_recent_snapshots(city: str, limit: int = 10) -> list:
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT city, timestamp, temperature, humidity,
                   condition, wind_speed, aqi
            FROM weather_snapshots
            WHERE city = :city
            ORDER BY timestamp DESC
            LIMIT :limit
        """), {"city": city, "limit": limit})
        return [dict(row._mapping) for row in result]        