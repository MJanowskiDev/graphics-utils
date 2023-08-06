import os
import numpy as np
from PIL import Image
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet
from io import BytesIO

def enhance_image(input_image, outputScale):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    model_path = os.path.join(dir_path, 'models', 'RealESRGAN_x2plus.pth')

    netscale = 2
    #model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
    print('here')
    # Convert the input image to a numpy array
    input_image_np = np.array(input_image)
    dni_weight = None
    # Restorer
    upsampler = RealESRGANer(
        scale=netscale,
        dni_weight=dni_weight,
        model_path=model_path,
        tile=0,
        tile_pad=10,
        pre_pad=10,
        half=False,
        model=model)
    print('here2')
    # Enhance the input image
    enhanced_image_np = upsampler.enhance(input_image_np, outputScale)
    print('here3')
    # Convert the enhanced image back to a PIL image
    enhanced_image = Image.fromarray(enhanced_image_np[0].astype('uint8'))

    print('here4')
    # Convert the PIL image to bytes
    img_enhanced_bytes = BytesIO()
    enhanced_image.save(img_enhanced_bytes, format='PNG')
    img_enhanced_bytes.seek(0)

    return img_enhanced_bytes
