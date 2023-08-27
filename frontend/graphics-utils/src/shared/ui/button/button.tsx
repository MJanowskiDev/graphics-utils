import { ButtonProps, Size, Variant } from './types';
import { Spinner } from '../spinner';

export const Button: React.FC<ButtonProps> = ({
  children,
  startIcon,
  onClick,
  classes,
  label,
  size = 'medium',
  variant = 'primary',
  outlined = false,
  disabled = false,
  loading = false,
  ...rest
}) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled || loading}
      className={getButtonClassNames(size, variant, outlined, disabled, loading, classes)}
    >
      {startIcon} {label} {children} {loading && <Spinner />}
    </button>
  );
};

const getButtonClassNames = (
  size: Size,
  variant: Variant,
  outlined: boolean,
  disabled: boolean,
  loading: boolean,
  classes?: string,
): string => {
  return `
    ${getSizeClasses(size)}
    ${getVariantClasses(variant, disabled || loading)}
    ${getOutlinedClasses(outlined, variant, disabled || loading)}
    ${!disabled && !loading ? 'transform active:scale-95 transition-transform duration-100' : ''}
    text-white font-bold rounded
    transition duration-300 ease-in-out
    disabled:opacity-20
    rounded-lg
    select-none
    flex gap-3 justify-center items-center
    ${classes ? classes : ''} 
  `.trim();
};

const getSizeClasses = (size: Size) => {
  switch (size) {
    case 'small':
      return 'py-1 px-3 text-sm';
    case 'medium':
      return 'py-2 px-4';
    case 'large':
      return 'py-3 px-6 text-lg';
  }
};

const getVariantClasses = (variant: Variant, disabled: boolean) => {
  const baseClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-transparent text-current',
  };

  const hoverClasses = {
    primary: 'hover:bg-primaryShade',
    secondary: 'hover:bg-neutralMedium',
    tertiary: 'hover:underline hover:underline-offset-4 hover:decoration-1',
  };

  return disabled ? baseClasses[variant] : `${baseClasses[variant]} ${hoverClasses[variant]}`;
};

const getOutlinedClasses = (outlined: boolean, variant: Variant, disabled: boolean): string => {
  if (!outlined) return '';

  const baseClasses = {
    primary: 'border-2 border-primary bg-transparent',
    secondary: 'border-2 border-secondary bg-transparent',
    tertiary: '',
  };

  const hoverClasses = {
    primary: 'hover:bg-primaryShade hover:border-primaryShade',
    secondary: 'hover:bg-neutralMedium hover:border-neutralMedium',
    tertiary: '',
  };

  return disabled ? baseClasses[variant] : `${baseClasses[variant]} ${hoverClasses[variant]}`;
};

//#9DACFF vista blue
//#FB3640 imperial red
//#9799CA cool gray
