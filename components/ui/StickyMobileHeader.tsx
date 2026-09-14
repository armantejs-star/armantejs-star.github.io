import React from 'react';

interface StickyMobileHeaderProps {
  label?: string;
  totalCashNeeded: number;
  isVisible: boolean;
}

export function StickyMobileHeader({ 
  label = "Total Cash Needed", 
  totalCashNeeded,
  isVisible 
}: StickyMobileHeaderProps) {
  
  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur shadow-md md:hidden transition-all duration-300 border-b border-slate-700">
      <div className="flex justify-between items-center px-4 py-3 max-w-md mx-auto">
        <span className="text-slate-300 text-sm font-medium tracking-wide">
          {label}
        </span>
        <span className="text-emerald-400 font-mono font-bold text-lg">
          ${totalCashNeeded.toLocaleString('en-AU')}
        </span>
      </div>
    </div>
  );
}