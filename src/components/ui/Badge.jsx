import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-[#F1EFE7] border-[#EAE8DF] text-[#77786F]',
    accent: 'bg-[#EDF2E9] border-[#C8D9CA] text-[#526B56]',
    cyan: 'bg-[#EDF2E9] border-[#C8D9CA] text-[#526B56]',
    emerald: 'bg-[#EDF2E9] border-[#C8D9CA] text-[#66866A]',
    success: 'bg-[#EDF2E9] border-[#C8D9CA] text-[#66866A]',
    rose: 'bg-[#FCEEED] border-[#E8C5C3] text-[#C66D65]',
    danger: 'bg-[#FCEEED] border-[#E8C5C3] text-[#C66D65]',
    amber: 'bg-[#FDF3E3] border-[#E8D5B0] text-[#C18A48]',
    warning: 'bg-[#FDF3E3] border-[#E8D5B0] text-[#C18A48]',
    violet: 'bg-[#F3EEF8] border-[#DECDEE] text-[#7C5ABF]',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default React.memo(Badge);
