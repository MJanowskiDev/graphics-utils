import ReactCompareImage from 'react-compare-image';

const kiwiImg = '/kiwi.jpeg';
const kiwiImgNoGb = '/kiwi_nobg.png';

const flowerLowRes = '/flower_to_upscale.png';
const flowerHighRes = '/flower_upscaled.png';

const colorfulImage = '/parrot.jpeg';
const grayscaleImage = '/parrot_grayscale.jpeg';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Example/CompareImages',
  component: ReactCompareImage,
};

export const BackgroundRemoval = () => (
  <div style={{ width: '600px' }}>
    <ReactCompareImage leftImage={kiwiImg} rightImage={kiwiImgNoGb} />
  </div>
);

export const SuperResolution = () => (
  <div style={{ width: '500px' }}>
    <ReactCompareImage leftImage={flowerLowRes} rightImage={flowerHighRes} />
  </div>
);

export const Grayscale = () => (
  <div style={{ width: '700px' }}>
    <ReactCompareImage leftImage={colorfulImage} rightImage={grayscaleImage} />
  </div>
);
