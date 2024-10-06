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
from shared.utils.errors import exception_to_json
from shared.utils.url_utils import construct_absolute_url


class BaseAdapter:

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

    async def scrape(self, task_id, configuration):
        try:
            async with async_playwright() as p:
                self.publish_to_kafka(self.kafka_config.get("topik"), "update_task", {
                    "task_id": task_id,
                    "status": "PROCESSING",
                })

                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                artifacts = []
                await page.goto(configuration['url'])
                await page.wait_for_selector(configuration['wait_for_selector'], state='attached', timeout=10000)

                platform = find_or_create_node(Platform, {"name": self.platform_name})
                scrapper = find_or_create_node(Scrapper, {"name": self.adapter_name})
                url_node = create_url_node(configuration['url'])
                url_node.access_time = datetime.now()
                url_node.found_at.connect(platform)
                url_node.scrapped_by.connect(scrapper)

                url_node.save()

                artifacts.extend([platform, scrapper, url_node])

                for selector in configuration['selectors']:
                    product_nodes = await page.query_selector_all(selector['selector'])

                    for node in product_nodes:
                        if selector['extract_from'] == "attribute":
                            value = await node.get_attribute(selector['attribute_name'])
                        elif selector['extract_from'] == "text":
                            value = await node.inner_text()
                        elif selector['extract_from'] == "html":
                            value = await node.inner_html()

                        if selector['artifact_type'] == 'Url':
                            value = construct_absolute_url(value, configuration['url'])
                            neo_node = create_url_node(value)
                            neo_node.found_at.connect(platform)
                            neo_node.scrapped_by.connect(scrapper)
                        else:
                            neo_node = find_or_create_node(Artifact, {
                                "artifact_type": selector['artifact_type'],
                                "artifact_property": selector['artifact_attribute'],
                                "artifact_value": value,
                                "metadata": selector
                            })
                            neo_node.containing_url.connect(url_node)

                        artifacts.extend([neo_node])

                        if selector.get('task_adapter') and selector.get('task_configuration'):
                            new_task_configuration = json.loads(
                                json.dumps(selector['task_configuration'])
                            )

                            new_task_configuration['url'] = new_task_configuration['url'].replace(
                                "{{value}}",
                                construct_absolute_url(
                                    value,
                                    configuration['url']
                                )
                            )

                            self.publish_to_kafka(self.kafka_config.get("topik"), "schedule_task", {
                                "task_id": task_id,
                                "adapter_type": selector["task_adapter"],
                                "configuration": new_task_configuration
                            })

                self.publish_to_kafka(self.kafka_config.get("topik"), "update_task", {
                    "task_id": task_id,
                    "status": "COMPLETED",
                    "executed_at": datetime.now().isoformat(),
                    "artifacts": [artifact.element_id for artifact in artifacts]
                })

                await browser.close()
        except Exception as e:
            print(f"Failed to scrape {configuration['url']}: {e}")
            self.publish_to_kafka(self.kafka_config.get("topik"), "update_task", {
                "task_id": task_id,
                "status": "FAILED",
                "executed_at": datetime.now().isoformat(),
                "error": exception_to_json(e)
            })

    def publish_to_kafka(self, topic, key, value):
        try:
            self.kafka_producer.produce(topic, key=key, value=json.dumps(value).encode('utf-8'))
            self.kafka_producer.flush()
            print(f"Message published to topic {topic}: {key} -> {value}")
        except Exception as e:
            print(f"Failed to publish message: {e}")

    def close(self):
        pass
