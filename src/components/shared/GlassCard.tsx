import { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export default function GlassCard({ children, className = '', hover = false, style }: GlassCardProps) {
  return (
    <div
      className={`bg-[var(--glass-bg)] backdrop-blur-glass border border-[var(--glass-border)] rounded-2xl p-6 shadow-glass ${
        hover ? 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300' : ''
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
