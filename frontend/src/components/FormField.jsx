import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  isValid,
  required = false,
  children,
  helperText,
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative rounded-lg shadow-sm">
        {children ? (
          children
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors outline-none ${
              error
                ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                : isValid
                ? 'border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
            }`}
          />
        )}

        {/* Status Icons */}
        {!children && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {error ? (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            ) : isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : null}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11.5px] text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="flex items-center gap-1 text-[12px] font-semibold text-rose-600 animate-fadeIn">
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
};
