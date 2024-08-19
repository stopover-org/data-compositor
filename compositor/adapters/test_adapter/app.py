from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
from src.adapter import Adapter

app = FastAPI()


@app.get("/{id}")
async def root(id):
    neo4j_uri = os.environ['NEO4J_URI']
    neo4j_user = os.environ['NEO4J_USER']
    neo4j_password = os.environ['NEO4J_PASSWORD']

    kafka_servers = os.environ['KAFKA_SERVERS']
    kafka_user = os.environ['KAFKA_USER']
    kafka_password = os.environ['KAFKA_PASSWORD']

    url = "https://webscraper.io/test-sites/e-commerce/allinone"

    adapter = Adapter({
            "uri": neo4j_uri,
            "user": neo4j_user,
            "password": neo4j_password
        },
        {
            "servers": kafka_servers,
            "user": kafka_user,
            "password": kafka_password
        })
    await adapter.scrape(url, id)
    adapter.close()
    return JSONResponse(status_code=200, content={"message": "Scraping completed successfully"})
