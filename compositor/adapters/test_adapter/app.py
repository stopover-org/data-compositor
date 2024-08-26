import json
import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from jsonschema import validate

from src.adapter import Adapter

app = FastAPI()

with open('./schema.json', 'r') as file:
    schema = json.load(file)


@app.post("/{task_id}")
async def root(task_id, request: Request):
    neo4j_host = os.environ['NEO4J_HOST']
    neo4j_port = os.environ['NEO4J_PORT']
    neo4j_user = os.environ['NEO4J_USER']
    neo4j_password = os.environ['NEO4J_PASSWORD']

    kafka_servers = os.environ['KAFKA_SERVERS']
    kafka_user = os.environ['KAFKA_USER']
    kafka_password = os.environ['KAFKA_PASSWORD']
    kafka_topik = os.environ['KAFKA_TOPIK']

    url = "https://webscraper.io/test-sites/e-commerce/allinone"

    adapter = Adapter(
        {
            "host": neo4j_host,
            "port": neo4j_port,
            "user": neo4j_user,
            "password": neo4j_password
        },
        {
            "servers": kafka_servers,
            "user": kafka_user,
            "password": kafka_password,
            "topik": kafka_topik,
        })

    json_data = await request.json()

    validate(instance=json_data, schema=schema)

    await adapter.scrape(task_id, json_data)
    adapter.close()
    return JSONResponse(status_code=200, content={"message": "Scraping completed successfully"})
