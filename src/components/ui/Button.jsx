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
  const base = 'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526B56] focus-visible:ring-offset-2 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#526B56] text-white border border-[#445A48] hover:bg-[#445A48] shadow-sm hover:shadow-md active:translate-y-px',
    secondary: 'bg-[#F1EFE7] text-[#22251F] border border-[#EAE8DF] hover:bg-[#E8E5DB] hover:border-[#D5D2C8]',
    outline: 'bg-transparent text-[#526B56] border border-[#526B56]/40 hover:bg-[#EDF2E9] hover:border-[#526B56]/70',
    danger: 'bg-[#FCEEED] text-[#C66D65] border border-[#C66D65]/30 hover:bg-[#C66D65] hover:text-white',
    ghost: 'bg-transparent text-[#77786F] border border-transparent hover:text-[#22251F] hover:bg-[#F1EFE7]',
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
