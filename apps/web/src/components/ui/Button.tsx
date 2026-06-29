interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({ onClick, children, className = '', type = 'button', disabled }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.25 rounded-2xl bg-[#CCB5F0] text-surface-50 text-btn-lg ${className}`}
    >
      {children}
    </button>
  );
}
