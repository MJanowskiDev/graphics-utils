import logging
import os
from flask import Flask, request, send_file
from rembg import remove, new_session
from io import BytesIO

from algorithms.esrgan.main import enhance_image
from PIL import Image
from validation import validate_SRGAN_model_name


app = Flask(__name__)
gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

model_name = os.getenv("MODEL_NAME", "u2netp")


@app.route('/')
def health():
    app.logger.info('Processing health request')
    return 'OK'


@app.route('/removebg/', methods=['POST'])
def remove_background():
    app.logger.info(
        'Processing remove_background request used model:', model_name)
    print('Processing remove_background request used model:', model_name)
    if 'image' not in request.files:
        return 'No image provided', 400
    img = request.files['image'].read()

    my_session = new_session(model_name)
    img_no_bg_bytes = remove(img, session=my_session)

    img_no_bg = BytesIO(img_no_bg_bytes)

    return send_file(img_no_bg, mimetype='image/png')


@app.route('/enhance/', methods=['POST'])
def enhance():
    scale = float(request.args.get('scale', '1'))
    if scale > 4:
        return 'Scale must be 4 or less', 400
    elif scale < 1:
        return 'Scale must be 1 or more', 400

    model_name_enum, status_code = validate_SRGAN_model_name()
    if status_code != 200:
        return model_name_enum, status_code

    if 'image' not in request.files:
        return 'No image provided', 400
    
    app.logger.info(f'Processing enhance request used model: {model_name_enum.value}, scale: {scale}')

    input_image = Image.open(request.files['image'])
    img_enhanced_bytes = enhance_image(input_image, scale, model_name_enum)
    return send_file(img_enhanced_bytes, mimetype='image/png')


if __name__ == "__main__":
    app.run(host='::', port=4100)
