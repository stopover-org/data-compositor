from urllib.parse import urlparse, parse_qs

from neomodel import StructuredNode, StringProperty, DateTimeProperty, Relationship, IntegerProperty, JSONProperty

from shared.accessors import find_or_create_node
from shared.models.platform import Platform
from shared.models.scrapper import Scrapper


class Url(StructuredNode):
    url = StringProperty(required=True)
    scheme = StringProperty()
    host = StringProperty()
    port = IntegerProperty()
    path = StringProperty()
    query_params = JSONProperty()
    fragment = StringProperty()
    access_time = DateTimeProperty()

    found_at = Relationship(Platform, 'FOUND_AT')
    contain_url = Relationship('Url', 'CONTAINS')
    scrapped_by = Relationship(Scrapper, 'SCRAPPED_BY')


def create_url_node(url, parent_url=None):
    parent_host = urlparse(parent_url or url)
    parsed_url = urlparse(url)

    scheme = parsed_url.scheme or parent_host.scheme
    host = parsed_url.hostname or parent_host.hostname
    port = parsed_url.port
    path = parsed_url.path
    query_params = parse_qs(parsed_url.query)
    fragment = parsed_url.fragment

    return find_or_create_node(Url, {
        "url": url,
        "scheme": scheme,
        "host": host,
        "port": port,
        "path": path,
        "query_params": query_params,
        "fragment": fragment
    })
