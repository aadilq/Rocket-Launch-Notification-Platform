from apscheduler.schedulers.blocking import BlockingScheduler
from poller import fetch_launches
from database import SessionLocal
from models import Launch
from publisher import publish_event
from datetime import datetime, timezone
import threading
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

def check_launches():
    print("Polling the Space Devs API...")

    launches = fetch_launches()
    db = SessionLocal()

    try:
        for launch_data in launches:
            existing = db.query(Launch).filter(
                Launch.external_id == launch_data["external_id"]
            ).first()

            if existing is None:
                new_launch = Launch(**launch_data)
                db.add(new_launch)
                db.commit()
                print(f"New launch inserted: {launch_data['name']}")
            else:
                if existing.status != launch_data["status"]:
                    existing.status = launch_data["status"]
                    db.commit()
                    publish_event({
                        "launch_id" : existing.external_id, 
                        "event_type" : "STATUS_CHANGE",
                        "launch_name" : existing.name,
                        "agency" : existing.agency, 
                        "net" : str(existing.net),
                        "status" : existing.status
                    })
                if launch_data["net"]:
                    net = datetime.fromisoformat(launch_data["net"].replace("Z", "+00:00"))

                    now = datetime.now(timezone.utc)

                    hours_until = (net - now).total_seconds() / 3600

                    if 23.5 <= hours_until <= 24.5:
                        publish_event({
                            "launch_id" : existing.external_id, 
                             "event_type" : "T_MINUS_24HR",
                             "launch_name" : existing.name,
                             "agency" : existing.agency, 
                             "net" : str(existing.net),
                            "status" : existing.status
                        })

                    if 0.5 <= hours_until <= 1.5:
                        publish_event({
                            "launch_id" : existing.external_id, 
                             "event_type" : "T_MINUS_1HR",
                             "launch_name" : existing.name,
                             "agency" : existing.agency, 
                             "net" : str(existing.net),
                            "status" : existing.status       
                        })
    finally:
        db.close()

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"ok")
    def log_message(self, format, *args):
        pass

def run_health_server():
    port = int(os.environ.get("PORT", 8080))
    HTTPServer(("0.0.0.0", port), HealthHandler).serve_forever()

threading.Thread(target=run_health_server, daemon=True).start()

scheduler = BlockingScheduler()
scheduler.add_job(check_launches, 'interval', minutes=15, next_run_time=datetime.now(timezone.utc))
print("Ingestion service started. Polling every 15 minutes")
scheduler.start()




