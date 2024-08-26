from neomodel import StructuredNode, StringProperty


class Platform(StructuredNode):
    name = StringProperty(required=True)

    def to_dict(self):
        serializable_types = (str, int, float, bool, type(None), list, dict)
        return {key: value for key, value in vars(self).items() if isinstance(value, serializable_types)}
