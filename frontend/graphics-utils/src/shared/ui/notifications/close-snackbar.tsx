'use client';
import { SnackbarKey, useSnackbar } from 'notistack';

interface CloseButtonProps {
  snackKey: SnackbarKey;
}

const CloseButton: React.FC<CloseButtonProps> = ({ snackKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <button className="p-1 text-gray-200 focus:outline-none border-none" aria-label="close" onClick={() => closeSnackbar(snackKey)}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  );
};

export default CloseButton;
