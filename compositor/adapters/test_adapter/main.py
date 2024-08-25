import json
import os
import asyncio
import uvicorn

from dotenv import load_dotenv
from src.adapter import Adapter
from app import app

load_dotenv()


def lambda_handler(event, context):
    neo4j_uri = os.environ['NEO4J_URI']
    neo4j_user = os.environ['NEO4J_USER']
    neo4j_password = os.environ['NEO4J_PASSWORD']
    kafka_servers = os.environ['KAFKA_SERVERS']

    path_params = event.get('pathParameters', {})

    url = "https://webscraper.io/test-sites/e-commerce/allinone"

    adapter = Adapter({"uri": neo4j_uri,
                       "user": neo4j_user,
                       "password": neo4j_password
                      },
                      {"servers": kafka_servers,
                       "user": "kafka",
                       "password": "password"
                      })
    asyncio.run(adapter.scrape(url, path_params.get("id")))
    adapter.close()

    return {
        'statusCode': 200,
        'body': json.dumps('Scraping completed successfully')
    }


if __name__ == "__main__":
    print(os.getenv('PORT'))
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv('PORT')))
