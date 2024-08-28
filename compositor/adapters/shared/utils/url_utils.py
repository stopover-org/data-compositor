from urllib.parse import urlparse, urlunparse


def construct_absolute_url(relative_url, base_url=None):
    if base_url is None:
        # If base_url is None, assume relative_url is absolute and return it
        return relative_url

    # Parse the base URL
    parsed_base_url = urlparse(base_url)

    # Manually construct the absolute URL
    absolute_url = urlunparse((
        parsed_base_url.scheme,  # Scheme (e.g., https)
        parsed_base_url.netloc,  # Netloc (e.g., webscraper.io)
        relative_url,  # Path
        '',  # Params (empty)
        '',  # Query (empty)
        ''  # Fragment (empty)
    ))

    return absolute_url
