import json
import traceback


def exception_to_json(ex):
    error_info = {
        "type": type(ex).__name__,
        "message": str(ex),
        "traceback": traceback.format_exc()
    }
    return json.dumps(error_info, indent=4)
