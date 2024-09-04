def find_or_create_node(label, properties):
    node = label.get_or_create(properties)
    return node[0]
