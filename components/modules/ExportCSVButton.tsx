'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function ExportCSVButton() {
  const { current } = useAppStore();

  const handleExport = () => {
    const rows = [
      ['Master Property Engine - Strategy Export v4.0'],
      [''],
      ['--- 1. CORE PROPERTY METRICS ---'],
      ['Land Price', current.property.landPrice],
      ['Original Build Contract', current.property.buildPrice],
      ['Pre-Build Delay (Months)', current.preBuildDelayMonths],
      ['Builder Escalation (%/yr)', current.builderEscalationPct],
      [''],
      ['--- 2. FINANCIAL INPUTS ---'],
      ['Cash Deposit', current.cashDeposit],
      ['Applicant 1 Income', current.applicant1Income],
      ['Applicant 2 Income', current.applicant2Income],
      ['Monthly Debts', current.monthlyDebts],
      [''],
      ['--- 3. STRATEGY PARAMETERS ---'],
      ['PR Wait Time (Months)', current.expectedPRWaitMonths],
      ['Property Growth Est (%/yr)', current.propertyGrowthPct],
      ['ETF Return Est (%/yr)', current.etfReturnPct]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sa_property_strategy.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 print:hidden"
    >
      <Download className="w-4 h-4" />
      <span className="font-semibold text-sm">Export CSV</span>
    </button>
  );
}