'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

export function Tooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Auto-close when tapping outside on a phone
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
        // THIS is what fixes mobile! It toggles on tap.
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen); 
        }}
        onMouseEnter={() => setIsOpen(true)}   // Desktop hover
        onMouseLeave={() => setIsOpen(false)}  // Desktop hover
        className="text-slate-400 hover:text-emerald-500 focus:outline-none transition-colors"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-xs font-normal text-white bg-slate-800 rounded-lg shadow-xl top-full right-0 sm:left-1/2 sm:-translate-x-1/2 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}