from shared.base_adapter import BaseAdapter


class Adapter(BaseAdapter):

    def __init__(self, neo4j_config, kafka_config):
        super().__init__(neo4j_config, kafka_config)
        self.adapter_name = 'test-adapter'
        self.platform_name = 'Test Platform'
