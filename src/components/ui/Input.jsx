import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-ww-text-secondary block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ww-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border rounded-lg py-2.5 px-3.5 text-sm text-ww-text placeholder-ww-text-muted outline-none transition-all font-medium
            ${error ? 'border-ww-danger focus:ring-2 focus:ring-ww-danger/20' : 'border-ww-border focus:border-ww-accent focus:ring-2 focus:ring-ww-accent/15'}
            ${Icon ? 'pl-10' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-ww-danger">{error}</p>}
    </div>
  );
};

export default React.memo(Input);
