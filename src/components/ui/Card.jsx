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
    default: 'bg-white border-[#EAE8DF] shadow-[0_1px_3px_rgba(34,37,31,0.04)]',
    elevated: 'bg-[#FCFBF8] border-[#EAE8DF] shadow-[0_2px_8px_rgba(34,37,31,0.06)]',
    accent: 'bg-[#EDF2E9] border-[#D5DFD1]',
    solid: 'bg-[#F8F7F2] border-[#EAE8DF]',
    ghost: 'bg-transparent border-[#EAE8DF]',
  };

  const hoverStyle = hover
    ? 'hover:border-[#D5D2C8] hover:shadow-[0_4px_14px_rgba(34,37,31,0.07)]'
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
