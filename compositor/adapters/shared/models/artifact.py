from neomodel import StructuredNode, StringProperty, Relationship, JSONProperty

from shared.models.url import Url


class Artifact(StructuredNode):
    artifact_type = StringProperty(required=True)
    artifact_property = StringProperty(required=True)
    artifact_value = StringProperty(required=True)
    metadata = JSONProperty()

    containing_url = Relationship(Url, 'FOUND')
    similar_artifacts = Relationship('Artifact', 'SIMILAR')

    def to_dict(self):
        serializable_types = (str, int, float, bool, type(None), list, dict)
        return {key: value for key, value in vars(self).items() if isinstance(value, serializable_types)}
