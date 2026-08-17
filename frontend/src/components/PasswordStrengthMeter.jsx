import React from 'react';
import { Check, X } from 'lucide-react';
import { calculatePasswordStrength } from '../schemas/registrationSchema';

export const PasswordStrengthMeter = ({ password = '' }) => {
  if (!password) return null;

  const strength = calculatePasswordStrength(password);

  const checks = [
    { label: '8+ chars', passed: password.length >= 8 },
    { label: 'Uppercase (A-Z)', passed: /[A-Z]/.test(password) },
    { label: 'Lowercase (a-z)', passed: /[a-z]/.test(password) },
    { label: 'Number (0-9)', passed: /\d/.test(password) },
    { label: 'Special symbol (@$!%*?)', passed: /[@$!%*?&#^()_+\-=\[\]{};:\'",.<>\/\\|`~]/.test(password) },
  ];

  return (
    <div className="mt-2 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-500">Password Strength:</span>
        <span className={`font-bold ${
          strength.score === 1 ? 'text-rose-600' : strength.score === 2 ? 'text-amber-600' : 'text-emerald-600'
        }`}>
          {strength.label}
        </span>
      </div>

      {/* 3-Bar Segment Progress Meter */}
      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${
          strength.score >= 1 ? (strength.score === 1 ? 'bg-rose-500' : strength.score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'
        }`} />
        <div className={`h-full rounded-full transition-all duration-300 ${
          strength.score >= 2 ? (strength.score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'
        }`} />
        <div className={`h-full rounded-full transition-all duration-300 ${
          strength.score >= 3 ? 'bg-emerald-500' : 'bg-transparent'
        }`} />
      </div>

      {/* Requirement Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {checks.map((c, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              c.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
            }`}
          >
            {c.passed ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};
