import { ReactNode } from "react";

interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}
export const SubmitButton = ({
  children,
  className,
  disabled,
}: SubmitButtonProps) => {
  return (
    <button
      className={`${
        className
          ? className
          : "block w-full rounded-lg bg-purple-600 text-white text-md p-2.5"
      }`}
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
};
