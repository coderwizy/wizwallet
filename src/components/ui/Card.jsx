import React from 'react';

const Card = ({
  children,
  className = '',
  hover = true,
  variant = 'default',
  ...props
}) => {
  const base = 'rounded-2xl border transition-all duration-200';

  const variants = {
    default: 'bg-white border-ww-border shadow-[0_1px_3px_rgba(34,37,31,0.04)]',
    elevated: 'bg-ww-elevated border-ww-border shadow-[0_2px_8px_rgba(34,37,31,0.06)]',
    accent: 'bg-ww-green-bg border-ww-accent/20',
    solid: 'bg-ww-bg border-ww-border',
    ghost: 'bg-transparent border-ww-border',
  };

  const hoverStyle = hover
    ? 'hover:border-ww-border-strong hover:shadow-[0_4px_14px_rgba(34,37,31,0.07)]'
    : '';

  return (
    <div
      className={`${base} ${variants[variant] || variants.default} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default React.memo(Card);
