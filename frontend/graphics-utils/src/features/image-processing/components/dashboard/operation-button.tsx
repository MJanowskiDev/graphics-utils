import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

interface OperationButtonProps {
  href: string;
  name: string;
  image: StaticImageData;
}

export const OperationButton = ({ href, name, image }: OperationButtonProps) => {
  return (
    <Link href={href} passHref>
      <div
        className="relative w-[200px] h-[200px] overflow-hidden text-white 
          rounded-2xl border border-white border-opacity-30 flex-col 
          justify-start items-start inline-flex hover:shadow-lg hover:border-opacity-60 transition-all ease-in-out duration-300"
      >
        <Image src={image} alt={name} layout="fill" objectFit="cover" />
        <div className="absolute flex mt-2 ml-2 w-[100px]">
          <p className="text-lg">{name}</p>
        </div>
      </div>
    </Link>
  );
};
