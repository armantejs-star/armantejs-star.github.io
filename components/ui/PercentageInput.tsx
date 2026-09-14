'use client';

import React from 'react';

interface PercentageInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function PercentageInput({ label, value, onChange, max = 100 }: PercentageInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFloat(e.target.value);
    
    if (isNaN(rawValue)) {
      onChange(0);
      return;
    }
    
    // Prevent user from entering a number higher than the max limit
    const clampedValue = Math.min(Math.max(rawValue, 0), max);
    onChange(clampedValue);
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-medium"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-slate-500 font-medium">%</span>
        </div>
      </div>
    </div>
  );
}