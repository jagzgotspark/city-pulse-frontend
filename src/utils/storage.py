import json
import os
from datetime import datetime

def save_to_file(data: dict, folder: str = "data") -> str:
    os.makedirs(folder, exist_ok=True)
    filename = f"{folder}/{data['city']}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    return filename