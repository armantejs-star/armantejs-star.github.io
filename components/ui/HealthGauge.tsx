import React from 'react';

interface HealthGaugeProps {
  label: string;
  currentValue: number;
  maxValue: number;
  formatAsCurrency?: boolean;
}

export function HealthGauge({ label, currentValue, maxValue, formatAsCurrency = true }: HealthGaugeProps) {
  const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Determine health color based on utilization thresholds
  let healthColor = 'bg-emerald-500'; // Under 80% (Safe)
  if (percentage >= 80 && percentage <= 95) healthColor = 'bg-alert-yellow'; // 80-95% (Warning)
  if (percentage > 95) healthColor = 'bg-alert-red'; // Over 95% (Danger)

  const displayCurrent = formatAsCurrency ? `$${currentValue.toLocaleString('en-AU')}` : currentValue;
  const displayMax = formatAsCurrency ? `$${maxValue.toLocaleString('en-AU')}` : maxValue;

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900">{displayCurrent}</span>
          <span className="text-xs font-medium text-slate-500 ml-1">/ {displayMax}</span>
        </div>
      </div>
      
      {/* Background Track */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        {/* Animated Fill */}
        <div 
          className={`h-full ${healthColor} transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      
      {/* Warning Text if over max */}
      {percentage > 100 && (
        <span className="text-xs font-semibold text-alert-red mt-1">
          Exceeds maximum limit by {formatAsCurrency ? `$${(currentValue - maxValue).toLocaleString('en-AU')}` : currentValue - maxValue}
        </span>
      )}
    </div>
  );
}