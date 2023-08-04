import logging
import os
import requests
from flask import Flask, request, send_file
from rembg import remove, new_session
from io import BytesIO

app = Flask(__name__)
gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

storage_path = os.getenv("STORAGE_PATH", "./storage")
os.makedirs(storage_path, exist_ok=True)
os.chdir(storage_path)

u2net_path = os.getenv("U2NET_PATH", "./u2net.onnx")
model_name = os.getenv("MODEL_NAME", "u2netp")

def download_u2net_model():
    url = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx"
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(u2net_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

if not os.path.exists(u2net_path):
    download_u2net_model()

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

if __name__ == "__main__":
    app.run(host='::', port=4100)
