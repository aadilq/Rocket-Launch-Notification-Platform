import pika
import json
import psycopg2
import os

DATABASE_URL = os.environ["DATABASE_URL"]
RABBITMQ_URL = os.environ["RABBITMQ_URL"]

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute("""
    SELECT l.external_id, l.name, l.agency, l.net, l.status
    FROM launches l
    JOIN subscriptions s ON s.launch_id = l.id
    LIMIT 1
""")
row = cur.fetchone()
cur.close()
conn.close()

if not row:
    print("No subscribed launches found. Subscribe to a launch via the UI first.")
    exit(1)

external_id, name, agency, net, status = row
print(f"Found subscribed launch: {name} ({agency})")

event = {
    "launch_id": external_id,
    "event_type": "STATUS_CHANGE",
    "launch_name": name,
    "agency": agency,
    "net": net.isoformat() if hasattr(net, "isoformat") else str(net),
    "status": status
}

params = pika.URLParameters(RABBITMQ_URL)
connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue="launch_events", durable=True)
channel.basic_publish(
    exchange="",
    routing_key="launch_events",
    body=json.dumps(event),
    properties=pika.BasicProperties(delivery_mode=2)
)
connection.close()

print(f"Test event published for '{name}'. Check your email and SendGrid Activity Feed.")
