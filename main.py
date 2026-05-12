from src.fetchers.weather import fetch_weather
from src.fetchers.air_quality import fetch_air_quality
from src.utils.transform import clean_weather
from src.utils.database import init_db, save_snapshot
from src.utils.database import get_recent_snapshots

init_db()

raw_weather = fetch_weather("Lucknow")

if raw_weather is None:
    print("Weather fetch failed")
else:
    lat = raw_weather["coord"]["lat"]
    lon = raw_weather["coord"]["lon"]
    clean = clean_weather(raw_weather)

    raw_air = fetch_air_quality(lat, lon)
    if raw_air:
        clean["aqi"] = raw_air["list"][0]["main"]["aqi"]
    else:
        clean["aqi"] = None

    save_snapshot(clean)

recent = get_recent_snapshots("Lucknow", limit=5)
for snapshot in recent:
    print(snapshot)