from neomodel import StructuredNode, StringProperty, DateTimeProperty, Relationship

from shared.models.platform import Platform
from shared.models.scrapper import Scrapper


class Url(StructuredNode):
    url = StringProperty(required=True)
    name = StringProperty(required=True)
    access_time = DateTimeProperty()

    found_at = Relationship(Platform, 'FOUND_AT')
    contain_url = Relationship('Url', 'CONTAINS')
    scrapped_by = Relationship(Scrapper, 'SCRAPPED_BY')
