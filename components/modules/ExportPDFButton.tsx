'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function ExportPDFButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 print:hidden"
    >
      <Printer className="w-4 h-4" />
      <span className="font-semibold text-sm">Export to PDF</span>
    </button>
  );
}