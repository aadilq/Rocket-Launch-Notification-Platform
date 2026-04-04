import requests

BASE_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=25"

def fetch_launches():
    response = requests.get(BASE_URL)
    response.raise_for_status()

    data = response.json()
    launches = []

    for item in data.get("results", []):
        launch = {
            "external_id": str(item.get("id")),
            "name": item.get("name"),
            "agency": item.get("launch_service_provider", {}).get("name", "Unknown"),
            "status": item.get("status", {}).get("name", "TBD"),
            "net": item.get("net", None)
        }
        launches.append(launch)
    return launches
