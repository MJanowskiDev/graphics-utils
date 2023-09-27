import GrayscaleImage from '../../../public/images/dashboard/to-grayscale.png';
import BackgroundRemovalImage from '../../../public/images/dashboard/bg-removal.png';

import { OperationButton } from '@/features/image-processing/components';

export default function InitPasswordResetPage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6 items-center justify-center">
        <h1 className="text-2xl">Select image operation</h1>
        <div className="flex gap-4  flex-wrap  justify-center">
          <OperationButton href={'/bgremoval'} name={'Background Removal'} image={BackgroundRemovalImage} />
          <OperationButton href={'/grayscale'} name={'Grayscale'} image={GrayscaleImage} />
        </div>
      </div>
    </section>
  );
}
