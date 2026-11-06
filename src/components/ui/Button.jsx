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
  const base = 'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ww-accent focus-visible:ring-offset-2 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-ww-accent text-white border border-ww-accent-hover hover:bg-ww-accent-hover shadow-sm hover:shadow-md active:translate-y-px',
    secondary: 'bg-ww-bg-alt text-ww-text border border-ww-border hover:bg-ww-bg-alt-hover hover:border-ww-border-strong',
    outline: 'bg-transparent text-ww-accent border border-ww-accent/40 hover:bg-ww-green-bg hover:border-ww-accent/70',
    danger: 'bg-ww-danger-bg text-ww-danger border border-ww-danger/30 hover:bg-ww-danger hover:text-white',
    ghost: 'bg-transparent text-ww-text-secondary border border-transparent hover:text-ww-text hover:bg-ww-bg-alt',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
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
