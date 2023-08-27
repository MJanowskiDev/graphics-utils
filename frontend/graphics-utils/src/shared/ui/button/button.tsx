import { ButtonProps, Size, Variant } from './types';
import { Spinner } from '../spinner';

export const Button: React.FC<ButtonProps> = ({
  label = 'Set',
  size = Size.medium,
  variant = Variant.primary,
  outlined = false,
  disabled = false,
  loading = false,
}) => {
  return (
    <button disabled={disabled || loading} className={getButtonClassNames(size, variant, outlined, disabled, loading)}>
      <div className="flex gap-3">
        {label} {loading && <Spinner />}
      </div>
    </button>
  );
};

const getButtonClassNames = (size: Size, variant: Variant, outlined: boolean, disabled: boolean, loading: boolean): string => {
  return `
    ${getSizeClasses(size)}
    ${getVariantClasses(variant, disabled || loading)}
    ${getOutlinedClasses(outlined, variant, disabled || loading)}
    text-white font-bold rounded
    transition duration-300 ease-in-out
    disabled:opacity-50
    rounded-lg
    select-none
  `.trim();
};

const getSizeClasses = (size: Size) => {
  switch (size) {
    case Size.small:
      return 'py-1 px-3 text-sm';
    case Size.medium:
      return 'py-2 px-4';
    case Size.large:
      return 'py-3 px-6 text-lg';
  }
};

const getVariantClasses = (variant: Variant, disabled: boolean) => {
  const baseClasses = {
    [Variant.primary]: 'bg-primary',
    [Variant.secondary]: 'bg-secondary',
  };

  const hoverClasses = {
    [Variant.primary]: 'hover:bg-primaryShade',
    [Variant.secondary]: 'hover:bg-neutralMedium',
  };

  return disabled ? baseClasses[variant] : `${baseClasses[variant]} ${hoverClasses[variant]}`;
};

const getOutlinedClasses = (outlined: boolean, variant: Variant, disabled: boolean): string => {
  if (!outlined) return '';

  const baseClasses = {
    [Variant.primary]: 'border-2 border-primary bg-transparent',
    [Variant.secondary]: 'border-2 border-secondary bg-transparent',
  };

  const hoverClasses = {
    [Variant.primary]: 'hover:bg-primaryShade hover:border-primaryShade',
    [Variant.secondary]: 'hover:bg-neutralMedium hover:border-neutralMedium',
  };

  return disabled ? baseClasses[variant] : `${baseClasses[variant]} ${hoverClasses[variant]}`;
};

//#9DACFF vista blue
//#FB3640 imperial red
//#9799CA cool gray
