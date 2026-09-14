import React, { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  text: string;
  children?: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="relative group inline-flex items-center justify-center cursor-help ml-1.5">
      {/* If no children are passed, it defaults to a standard HelpCircle icon from lucide-react */}
      {children || <HelpCircle className="w-4 h-4 text-slate-400 hover:text-emerald-500 transition-colors" />}
      
      {/* Tooltip Body */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-slate-100 text-xs font-medium rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none leading-relaxed">
        {text}
        {/* Tooltip Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}