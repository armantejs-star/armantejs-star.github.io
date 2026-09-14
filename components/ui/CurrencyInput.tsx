'use client';

import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CurrencyInput({ label, value, onChange, disabled = false }: CurrencyInputProps) {
  // We keep a local string state so the user sees commas while typing
  const [displayValue, setDisplayValue] = useState('');

  // When the parent app sends a new number, format it with commas
  useEffect(() => {
    setDisplayValue(value === 0 ? '' : value.toLocaleString('en-AU'));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip out commas, dollar signs, and letters
    const rawString = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(rawString, 10);

    if (isNaN(numValue)) {
      setDisplayValue('');
      onChange(0);
    } else {
      setDisplayValue(numValue.toLocaleString('en-AU'));
      onChange(numValue);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-slate-400 font-medium">$</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={displayValue}
          onChange={handleChange}
          placeholder="0"
          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500 font-medium"
        />
      </div>
    </div>
  );
}