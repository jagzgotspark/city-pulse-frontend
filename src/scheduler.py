from apscheduler.schedulers.blocking import BlockingScheduler
from src.fetchers.weather import fetch_weather
from src.fetchers.air_quality import fetch_air_quality
from src.utils.transform import clean_weather
from src.utils.database import init_db, save_snapshot

def collect_city_data(city: str):
    print(f"Collecting data for {city}...")
    raw_weather = fetch_weather(city)

    if raw_weather is None:
        print(f"Skipping {city} — weather fetch failed")
        return

    lat = raw_weather["coord"]["lat"]
    lon = raw_weather["coord"]["lon"]
    clean = clean_weather(raw_weather)

    raw_air = fetch_air_quality(lat, lon)
    clean["aqi"] = raw_air["list"][0]["main"]["aqi"] if raw_air else None

    save_snapshot(clean)

def start_scheduler():
    init_db()
    scheduler = BlockingScheduler()
    scheduler.add_job(
        collect_city_data,
        "interval",
        minutes=15,
        args=["Lucknow"]
    )
    print("Scheduler started — collecting every 15 minutes")
    print("Press Ctrl+C to stop")
    scheduler.start()

if __name__ == "__main__":
    start_scheduler()