from flask import Flask
from flask import Flask, request, send_file
from rembg import remove
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'OK'

@app.route('/removebg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return 'No image provided', 400
    img = request.files['image'].read()

    img_no_bg_bytes = remove(img)
    img_no_bg = BytesIO(img_no_bg_bytes)

    return send_file(img_no_bg, mimetype='image/png')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4100)