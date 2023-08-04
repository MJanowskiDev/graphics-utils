import logging
import os
from flask import Flask, request, send_file
from rembg import remove
from io import BytesIO

app = Flask(__name__)
gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

storage_path = os.getenv("STORAGE_PATH", "./storage")
os.makedirs(storage_path, exist_ok=True)
os.chdir(storage_path)

@app.route('/')
def health():
    app.logger.info('Processing health request')
    return 'OK'

@app.route('/removebg/', methods=['POST'])
def remove_background():
    app.logger.info('Processing remove_background request')
    if 'image' not in request.files:
        return 'No image provided', 400
    img = request.files['image'].read()

    img_no_bg_bytes = remove(img)
    img_no_bg = BytesIO(img_no_bg_bytes)

    return send_file(img_no_bg, mimetype='image/png')

if __name__ == "__main__":
    app.run(host='::', port=4100)
