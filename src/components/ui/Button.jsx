import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-black uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    primary: 'btn-primary',
    secondary: 'bg-white/10 border border-white/15 text-white hover:bg-white/15 hover:border-white/30',
    outline: 'bg-transparent border border-neon-cyan/30 text-neon-blue hover:bg-neon-cyan/10 hover:border-neon-cyan/60',
    danger: 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/50',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] gap-1.5',
    md: 'px-4 py-2.5 text-xs gap-2',
    lg: 'px-6 py-3.5 text-sm gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default React.memo(Button);
