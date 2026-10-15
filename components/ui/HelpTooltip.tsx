'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

export function HelpTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Auto-close when the user taps somewhere else on their phone screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={tooltipRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen); // Toggles on mobile tap
        }}
        onMouseEnter={() => setIsOpen(true)}   // Opens on desktop hover
        onMouseLeave={() => setIsOpen(false)}  // Closes on desktop hover out
        className="text-slate-400 hover:text-emerald-500 focus:outline-none transition-colors ml-1"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-xs font-normal text-white bg-slate-800 rounded-lg shadow-xl top-full left-1/2 -translate-x-1/2 leading-relaxed">
          {/* The little triangle pointer at the top of the tooltip */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-slate-800"></div>
          {text}
        </div>
      )}
    </div>
  );
}