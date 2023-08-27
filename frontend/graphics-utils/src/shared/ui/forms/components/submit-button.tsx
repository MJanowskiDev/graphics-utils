import { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';

interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}
export const SubmitButton = ({ children, className, disabled }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={disabled} classes={className}>
      {children}
    </Button>
  );
};
