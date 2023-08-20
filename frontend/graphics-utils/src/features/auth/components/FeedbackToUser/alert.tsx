interface AlertProps {
  title: string;
  message: string;
  type: 'error' | 'success';
}
export const Alert = ({ title, message, type }: AlertProps) => {
  const alertStyles = {
    error: {
      bgColor: 'bg-red-100',
      border: 'border-red-400',
      textColor: 'text-red-700',
    },
    success: {
      bgColor: 'bg-green-100',
      border: 'border-green-400',
      textColor: 'text-green-700',
    },
  };

  const styles = alertStyles[type];

  return (
    <div className={`${styles.bgColor} ${styles.border} ${styles.textColor} px-4 py-3 rounded relative mb-2`} role="alert">
      <strong className="font-bold mr-2">{title}</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};
