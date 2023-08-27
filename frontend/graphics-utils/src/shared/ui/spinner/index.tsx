import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const Spinner = () => (
  <div className="flex justify-center items-center">
    <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 text-white" />
  </div>
);
