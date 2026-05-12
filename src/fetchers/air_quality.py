import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "http://api.openweathermap.org/data/2.5/air_pollution"

def fetch_air_quality(lat: float, lon: float) -> dict | None:
    try:
        params = {
            "lat": lat,
            "lon": lon,
            "appid": API_KEY
        }
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        print(f"Air quality request timed out")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None