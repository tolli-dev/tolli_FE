interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({ onClick, children, className = '', type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3.25 rounded-2xl bg-[#CCB5F0] text-surface-50 text-btn-lg ${className}`}
    >
      {children}
    </button>
  );
}
