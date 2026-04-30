import pika
import json
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

def publish_event(event):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()

    channel.queue_declare(queue="launch_events", durable=True)

    channel.basic_publish(
        exchange="",
        routing_key="launch_events", 
        body=json.dumps(event),
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )
    print(f"Published event: {event['event_type']} - {event['launch_name']}")
    connection.close()

