import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rose' | 'plum' | 'gold' | 'emerald' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'rose',
  className = '',
}) => {
  const variantStyles = {
    rose: 'bg-rosewood-50 text-rosewood-700 border-rosewood-200/80',
    plum: 'bg-plum-50 text-plum-800 border-plum-200/80',
    gold: 'bg-warmamber-50 text-warmamber-700 border-warmamber-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
