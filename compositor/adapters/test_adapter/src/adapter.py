import json
import socket
from datetime import datetime

from confluent_kafka import Producer
from neomodel import config
from playwright.async_api import async_playwright

from shared.accessors import find_or_create_node
from shared.models.artifact import Artifact
from shared.models.platform import Platform
from shared.models.scrapper import Scrapper
from shared.models.url import create_url_node


class Adapter:

    def __init__(self, neo4j_config, kafka_config):
        self.neo4j_config = neo4j_config
        config.DATABASE_URL = f'bolt://{neo4j_config["user"]}:{neo4j_config["password"]}@{neo4j_config["host"]}:{neo4j_config["port"]}'
        config.DATABASE_NAME = "neo4j"

        self.kafka_config = kafka_config
        if kafka_config.get('user'):
            self.kafka_producer = Producer({
                'bootstrap.servers': kafka_config.get("servers"),
                'sasl.username': kafka_config.get("user"),
                'sasl.password': kafka_config.get("password"),

                'security.protocol': 'PLAINTEXT',
            })

        else:
            self.kafka_producer = Producer({
                'bootstrap.servers': kafka_config.get("servers"),
                'client.id': socket.gethostname(),

                'security.protocol': 'PLAINTEXT',
            })

    async def scrape(self, url, task_id):
        async with async_playwright() as p:
            self.publish_to_kafka(self.kafka_config.get("topik"), "test_adapter", {
                "task_id": task_id,
                "status": "PROCESSING",
            })
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            artifacts = []
            await page.goto(url)
            await page.wait_for_selector('.card-body h4 a.title')

            product_titles = await page.query_selector_all('.card-body h4 a.title')

            platform = find_or_create_node(Platform, {"name": 'test-platform'})
            scrapper = find_or_create_node(Scrapper, {"name": 'TestAdapter'})
            url_node = create_url_node(url)
            url_node.access_time = datetime.now()
            url_node.found_at.connect(platform)
            url_node.scrapped_by.connect(scrapper)

            url_node.save()

            artifacts.extend([platform, scrapper, url_node])

            for title in product_titles:
                title_text = await title.get_attribute('title')
                title_url = await title.get_attribute('href')

                product_url_node = create_url_node(title_url, url)
                product_url_node.found_at.connect(platform)
                product_url_node.scrapped_by.connect(scrapper)
                product_url_node.save()

                url_node.contain_url.connect(product_url_node)
                url_node.save()

                product_title_artifact = find_or_create_node(Artifact, {
                    "artifact_type": 'Product',
                    "artifact_property": 'title',
                    "artifact_value": title_text,
                    "metadata": {}
                })
                product_url_artifact = find_or_create_node(Artifact, {
                    "artifact_type": 'Product',
                    "artifact_property": 'internal_url',
                    "artifact_value": title_url,
                    "metadata": {}
                })

                product_title_artifact.containing_url.connect(url_node)
                product_url_artifact.containing_url.connect(url_node)

                artifacts.extend([product_title_artifact, product_url_artifact, product_url_node])

            self.publish_to_kafka(self.kafka_config.get("topik"), "test_adapter", {
                "task_id": task_id,
                "status": "COMPLETED",
                "executed_at": datetime.now().isoformat(),
                "retries": 1,
                "artifacts": json.dumps([artifact.to_dict() for artifact in artifacts])
            })

            await browser.close()

    def publish_to_kafka(self, topic, key, value):
        try:
            self.kafka_producer.produce(topic, key=key, value=json.dumps(value).encode('utf-8'))
            self.kafka_producer.flush()
            print(f"Message published to topic {topic}: {key} -> {value}")
        except Exception as e:
            print(f"Failed to publish message: {e}")

    def close(self):
        pass
