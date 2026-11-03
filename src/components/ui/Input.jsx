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
        <label htmlFor={inputId} className="text-xs font-semibold text-[#77786F] block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A297]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border rounded-lg py-2.5 px-3.5 text-sm text-[#22251F] placeholder-[#A3A297] outline-none transition-all font-medium
            ${error ? 'border-[#C66D65] focus:ring-2 focus:ring-[#C66D65]/20' : 'border-[#EAE8DF] focus:border-[#526B56] focus:ring-2 focus:ring-[#526B56]/15'}
            ${Icon ? 'pl-10' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-[#C66D65]">{error}</p>}
    </div>
  );
};

export default React.memo(Input);
