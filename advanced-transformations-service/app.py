import logging
import os
from flask import Flask, request, send_file
from rembg import remove, new_session
from io import BytesIO

from algorithms.esrgan.main import enhance_image
from PIL import Image

import subprocess
from werkzeug.utils import secure_filename


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
    app.logger.info('Processing remove_background request used model:', model_name)
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
    app.logger.info('Processing enhance request used model: RealESRGAN_x4plus')
    scale = float(request.args.get('scale', '1'))

    if 'image' not in request.files:
        return 'No image provided', 400

    input_image = Image.open(request.files['image'])
    img_enhanced_bytes = enhance_image(input_image, scale)
    return send_file(img_enhanced_bytes, mimetype='image/png')

if __name__ == "__main__":
    app.run(host='::', port=4100)
