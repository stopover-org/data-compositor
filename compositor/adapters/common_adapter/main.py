import asyncio
import json
import os

import uvicorn
from dotenv import load_dotenv

from app import app
from src.adapter import Adapter

load_dotenv()


def lambda_handler(event, context):
    neo4j_host = os.environ['NEO4J_HOST']
    neo4j_port = os.environ['NEO4J_PORT']
    neo4j_user = os.environ['NEO4J_USER']
    neo4j_password = os.environ['NEO4J_PASSWORD']
    kafka_servers = os.environ['KAFKA_SERVERS']
    kafka_topik = os.environ['KAFKA_TOPIK']

    path_params = event.get('pathParameters', {})

    adapter = Adapter(
        {
            "host": neo4j_host,
            "port": neo4j_port,
            "user": neo4j_user,
            "password": neo4j_password
        },
        {
            "servers": kafka_servers,
            "user": "kafka",
            "password": "password",
            "topik": kafka_topik,
        })
    asyncio.run(adapter.scrape(path_params.get("id"), {}))
    adapter.close()

    return {
        'statusCode': 200,
        'body': json.dumps('Scraping completed successfully')
    }


if __name__ == "__main__":
    print(os.getenv('PORT'))
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv('PORT')))
