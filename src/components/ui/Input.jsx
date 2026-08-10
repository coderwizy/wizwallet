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
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-neon-blue focus:bg-white/5 transition-all font-medium ${
            Icon ? 'pl-11' : ''
          } ${error ? 'border-rose-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{error}</p>}
    </div>
  );
};

export default React.memo(Input);
