from datetime import datetime

def clean_weather(raw: dict) -> dict:
    return {
        "city": raw["name"],
        "timestamp": datetime.utcnow().isoformat(),
        "temperature": raw["main"]["temp"],
        "feels_like": raw["main"]["feels_like"],
        "humidity": raw["main"]["humidity"],
        "condition": raw["weather"][0]["main"],
        "description": raw["weather"][0]["description"],
        "wind_speed": raw["wind"]["speed"],
        "visibility": raw.get("visibility", None)
    }
