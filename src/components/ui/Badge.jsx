import React from 'react';

const Badge = ({
  children,
  variant = 'cyan',
  className = '',
}) => {
  const variants = {
    cyan: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
    violet: 'bg-violet-500/10 border-violet-500/25 text-violet-300',
    amber: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${variants[variant] || variants.cyan} ${className}`}>
      {children}
    </span>
  );
};

export default React.memo(Badge);
