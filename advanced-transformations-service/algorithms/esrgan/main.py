import os
import numpy as np
from PIL import Image
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan.archs.srvgg_arch import SRVGGNetCompact
from io import BytesIO
from algorithms.esrgan.enums import SRGANModelName


def enhance_image(input_image, outputScale, model_name, max_w = 400, max_h=400):
    width, height = input_image.size
    if width > max_w or height > max_h:
        raise ValueError(f"Image width and height must be {max_w}px x {max_h}px or less, provided image is {width}px x {height}px")


    model, netscale, file_url, dni_weight = _get_model(model_name)
    print(f'[ESRGAN]Starting image transgformation with model - {model_name.value}')
    input_image_np = np.array(input_image)

    upsampler = RealESRGANer(
        scale=netscale,
        dni_weight=dni_weight,
        model_path=file_url,
        tile=0,
        tile_pad=10,
        pre_pad=10,
        half=False,
        model=model)
    
    print(f'[ESRGAN]Enhancing image with output scale - {outputScale}')
    enhanced_image_np = upsampler.enhance(input_image_np, outputScale)
    enhanced_image = Image.fromarray(enhanced_image_np[0].astype('uint8'))

    print(f'[ESRGAN]Converting image to bytes')
    img_enhanced_bytes = BytesIO()
    enhanced_image.save(img_enhanced_bytes, format='PNG')
    img_enhanced_bytes.seek(0)

    print(f'[ESRGAN]Converting image processing finished')
    return img_enhanced_bytes


def _get_model(model_name):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_url = os.path.join(dir_path, 'models', f'{model_name.value}.pth')

    dni_weight = None

    if model_name == SRGANModelName.RealESRGAN_x4plus:  # x4 RRDBNet model
        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
        netscale = 4
    elif model_name == SRGANModelName.RealESRNet_x4plus:  # x4 RRDBNet model
        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
        netscale = 4
    elif model_name == SRGANModelName.RealESRGAN_x4plus_anime_6B:  # x4 RRDBNet model with 6 blocks
        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=6, num_grow_ch=32, scale=4)
        netscale = 4
    elif model_name == SRGANModelName.RealESRGAN_x2plus:  # x2 RRDBNet model
        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
        netscale = 2
    elif model_name == SRGANModelName.realesr_animevideov3:  # x4 VGG-style model (XS size)
        model = SRVGGNetCompact(num_in_ch=3, num_out_ch=3, num_feat=64, num_conv=16, upscale=4, act_type='prelu')
        netscale = 4

    return model, netscale, file_url, dni_weight
