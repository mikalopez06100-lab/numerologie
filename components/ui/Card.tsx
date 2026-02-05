import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  const baseStyles = 'rounded-xl p-6';
  
  const variants = {
    default: 'bg-[#FAF7F2] text-[#0D1B2A] shadow-lg',
    glass: 'glass text-[#FAF7F2]',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
