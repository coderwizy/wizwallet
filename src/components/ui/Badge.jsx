import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-ww-bg-alt border-ww-border text-ww-text-secondary',
    accent: 'bg-ww-green-bg border-ww-success/30 text-ww-accent',
    cyan: 'bg-ww-green-bg border-ww-success/30 text-ww-accent',
    emerald: 'bg-ww-green-bg border-ww-success/30 text-ww-success',
    success: 'bg-ww-green-bg border-ww-success/30 text-ww-success',
    rose: 'bg-ww-danger-bg border-ww-danger/30 text-ww-danger',
    danger: 'bg-ww-danger-bg border-ww-danger/30 text-ww-danger',
    amber: 'bg-ww-warning-bg border-ww-warning/30 text-ww-warning',
    warning: 'bg-ww-warning-bg border-ww-warning/30 text-ww-warning',
    violet: 'bg-ww-violet-bg border-ww-violet/30 text-ww-violet',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default React.memo(Badge);
