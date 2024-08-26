from neomodel import StructuredNode, StringProperty


class Scrapper(StructuredNode):
    name = StringProperty(required=True)
