import React from 'react';

const Card = ({
  children,
  className = '',
  hover = true,
  variant = 'default',
  ...props
}) => {
  const baseStyle = 'glass-card p-6 border transition-all duration-300';
  
  const variants = {
    default: 'bg-white lg:bg-[#08262d]/75 border-[#E5DFD1] lg:border-cyan-500/15 text-[#1C1917] lg:text-slate-100 shadow-xs lg:shadow-none',
    accent: 'bg-white lg:bg-gradient-to-br lg:from-[#063c46] lg:to-[#031f28] border-[#E5DFD1] lg:border-cyan-400/30 text-[#1C1917] lg:text-slate-100 shadow-xs lg:shadow-[0_0_40px_rgba(0,243,255,0.08)]',
    solid: 'bg-white lg:bg-[#041a1e] border-[#E5DFD1] lg:border-white/10 text-[#1C1917] lg:text-slate-100 shadow-xs lg:shadow-none',
    ghost: 'bg-[#F4EFE6] lg:bg-white/5 border-[#E5DFD1] lg:border-white/5 text-[#1C1917] lg:text-slate-100',
  };

  const hoverStyle = hover ? 'hover:border-cyan-400/40 hover:shadow-[0_12px_40px_-10px_rgba(0,243,255,0.2)]' : '';

  return (
    <div
      className={`${baseStyle} ${variants[variant] || variants.default} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default React.memo(Card);
