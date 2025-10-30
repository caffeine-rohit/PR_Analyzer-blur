import { ReactNode, ButtonHTMLAttributes } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'accent';
  icon?: ReactNode;
}

export default function GradientButton({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}: GradientButtonProps) {
  const gradientClass = variant === 'primary' ? 'bg-gradient-primary' : 'bg-gradient-accent';

  return (
    <button
      className={`${gradientClass} text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
