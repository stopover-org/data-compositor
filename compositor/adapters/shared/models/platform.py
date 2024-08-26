from neomodel import StructuredNode, StringProperty


class Platform(StructuredNode):
    name = StringProperty(required=True)
