from urllib.parse import urlparse, urlunparse


def construct_absolute_url(relative_url, base_url=None):
    # Parse the relative URL
    parsed_relative_url = urlparse(relative_url)

    # If the relative URL has a scheme and netloc, return it as it's already absolute
    if parsed_relative_url.scheme and parsed_relative_url.netloc:
        return relative_url

    # If base_url is None, assume relative_url is absolute and return it
    if base_url is None:
        return relative_url

    # Parse the base URL
    parsed_base_url = urlparse(base_url)

    # Manually construct the absolute URL
    absolute_url = urlunparse((
        parsed_base_url.scheme,
        parsed_base_url.netloc,
        relative_url,
        '',
        '',
        ''
    ))

    return absolute_url
