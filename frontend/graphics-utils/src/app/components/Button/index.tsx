export type ButtonProps = {
  label?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  outline?: boolean;
};
export const Button: React.FC<ButtonProps> = ({ label = 'Set', size = 'medium', variant = 'primary', outline = false }) => {
  const sizeClasses = size === 'large' ? 'py-3 px-6 text-lg' : size === 'small' ? 'py-1 px-3 text-sm' : 'py-2 px-4';

  const variantClasses =
    variant === 'secondary'
      ? 'bg-blue-500 hover:bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700'
      : 'bg-purple-700 hover:bg-purple-600 dark:bg-purple-900 dark:hover:bg-purple-800';

  const outlineClasses = outline
    ? `border-2 ${
        variant === 'secondary' ? 'border-blue-500 dark:border-blue-800' : 'border-purple-700 dark:border-purple-900'
      } bg-transparent`
    : '';

  return (
    <button className={`${sizeClasses} ${variantClasses} ${outlineClasses} text-white dark:text-gray-300 font-bold rounded`}>
      {label}
    </button>
  );
};
