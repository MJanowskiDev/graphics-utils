from flask import request
from algorithms.esrgan.enums import SRGANModelName

def validate_SRGAN_model_name():
    model_name_str = request.args.get('model')
    if model_name_str is None:
        return "Model name must be provided.", 400
    try:
        return SRGANModelName[model_name_str], 200
    except KeyError:
        return f"Invalid model name '{model_name_str}'. Must be one of {list(SRGANModelName.__members__.keys())}", 400
