type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = BaseButtonProps & {
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  onClick?: () => void;
  classes?: string;
  label?: string;
  size?: Size;
  variant?: Variant;
  outlined?: boolean;
  loading?: boolean;
};

export type Variant = 'primary' | 'secondary' | 'tertiary';
export type Size = 'small' | 'medium' | 'large';

export const VARIANT_OPTIONS: Variant[] = ['primary', 'secondary', 'tertiary'];
export const SIZE_OPTIONS: Size[] = ['small', 'medium', 'large'];
