from neomodel import StructuredNode, StringProperty, Relationship, JSONProperty

from shared.models.url import Url


class Artifact(StructuredNode):
    artifact_type = StringProperty(required=True)
    artifact_property = StringProperty(required=True)
    artifact_value = StringProperty(required=True)
    metadata = JSONProperty()

    containing_url = Relationship(Url, 'FOUND')
    similar_artifacts = Relationship('Artifact', 'SIMILAR')
