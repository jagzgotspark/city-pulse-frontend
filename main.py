from src.fetchers.weather import fetch_weather
from src.fetchers.air_quality import fetch_air_quality
from src.utils.transform import clean_weather
from src.utils.storage import save_to_file

raw_weather = fetch_weather("Lucknow")

if raw_weather is None:
    print("Weather fetch failed")
else:
    lat = raw_weather["coord"]["lat"]
    lon = raw_weather["coord"]["lon"]

    clean = clean_weather(raw_weather)

    raw_air = fetch_air_quality(lat, lon)
    if raw_air:
        aqi = raw_air["list"][0]["main"]["aqi"]
        clean["aqi"] = aqi

    filename = save_to_file(clean)
    print(f"Saved to {filename}")