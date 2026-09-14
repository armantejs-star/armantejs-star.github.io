'use client';

import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  valueLabel?: string; // Optional text to show next to the number, like "Months"
}

export function Slider({ label, value, min, max, onChange, valueLabel = '' }: SliderProps) {
  
  // Calculate the percentage to fill the green track behind the slider thumb
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          {value} {valueLabel}
        </span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        style={{
          background: `linear-gradient(to right, #10b981 ${percentage}%, #e2e8f0 ${percentage}%)`
        }}
      />
      <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}