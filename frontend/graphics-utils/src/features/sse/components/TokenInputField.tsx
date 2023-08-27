import { useRef } from 'react';

import { Button } from '@/shared/ui';

interface TokenInputFieldProps {
  setToken: (token: string) => void;
}

export const TokenInputField = ({ setToken }: TokenInputFieldProps) => {
  const tokenInputRef = useRef<HTMLInputElement>(null);

  const handleOnSetTokenClick = () => {
    setToken(tokenInputRef.current?.value || '');
  };

  return (
    <div className="w-120 px-10">
      <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="token">
        Auth token
      </label>
      <div className="relative flex flex-row">
        <input
          className="bg-transparent border border-gray-300 rounded-lg p-2 text-lg flex-grow mr-4 outline-none"
          ref={tokenInputRef}
          type="text"
          placeholder="Enter token"
        />
        <Button onClick={handleOnSetTokenClick}>Set</Button>
      </div>
    </div>
  );
};
