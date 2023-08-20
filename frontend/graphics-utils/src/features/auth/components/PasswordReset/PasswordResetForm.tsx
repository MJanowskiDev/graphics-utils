'use client';

interface PasswordResetFormProps {
  password: string;
  setPassword: (password: string) => void;
  onSubmit: () => void;
}

export const PasswordResetForm = ({ password, setPassword, onSubmit }: PasswordResetFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        <span className="text-gray-400">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={handleChange}
          className="
                mt-1
                block
                w-full
                rounded-md
                bg-transparent
                border-gray-300
                shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                "
        />
      </label>
      <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md" type="submit">
        Submit
      </button>
    </form>
  );
};
