'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpFABProps {
  onClick: () => void;
}

export function HelpFAB({ onClick }: HelpFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-200 group"
      aria-label="Open Strategy Guide"
    >
      <HelpCircle className="w-7 h-7" />
      {/* Tooltip that appears on hover on Desktop */}
      <span className="absolute right-full mr-4 bg-slate-900 text-white text-sm font-medium py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Strategy Guide & Help
      </span>
    </button>
  );
}