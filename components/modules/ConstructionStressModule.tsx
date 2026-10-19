'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export function ConstructionStressModule() {
  const { current } = useAppStore();
  
  const build = current.property?.buildPrice || 300000;
  const rent = current.currentMonthlyRent || 0;
  const duration = current.buildDurationMonths || 9;
  
  // Assume a 6% construction loan rate
  const monthlyRate = 0.06 / 12;
  
  // The peak cashflow hit happens right after the "Fixing" stage is drawn (approx 90% of loan drawn)
  const peakDrawn = build * 0.90;
  const peakInterest = peakDrawn * monthlyRate;
  const peakCashflow = rent + peakInterest;

  // Generate an S-curve array to simulate builder progress payments
  const months = Array.from({ length: duration }, (_, i) => {
    const monthNum = i + 1;
    // S-curve approximation of draws over time (maxes at 90% before completion)
    const progressPct = Math.min(0.90, Math.pow(monthNum / duration, 1.5) * 0.90);
    const drawn = build * progressPct;
    const interest = drawn * monthlyRate;
    return { monthNum, interest, rent };
  });

  return (
    <Card className="p-6 space-y-6 border-l-4 border-l-amber-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            &quot;Double-Hit&quot; Cashflow Stress Test
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualizing the overlapping cost of paying current rent while the construction loan draws down.
          </p>
        </div>
        <div className="text-left md:text-right bg-amber-50 px-4 py-3 rounded-lg border border-amber-100 min-w-50">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Peak Monthly Outgoings</p>
          <p className="text-3xl font-black text-amber-600">${Math.round(peakCashflow).toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated {duration}-Month Construction Timeline</h3>
        
        {/* CSS Flex Graph */}
        <div className="flex items-end gap-1 h-56 w-full border-b border-slate-200 pb-2">
          {months.map((m) => (
            <div key={m.monthNum} className="flex-1 flex flex-col justify-end group relative h-full">
              {/* Hover Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap z-10 transition-opacity pointer-events-none">
                <span className="font-bold">Month {m.monthNum}</span><br/>
                Rent: ${Math.round(m.rent).toLocaleString()}<br/>
                Interest: ${Math.round(m.interest).toLocaleString()}
              </div>
              
              {/* Interest Bar */}
              <div 
                style={{ height: `${(m.interest / Math.max(peakCashflow, 1)) * 100}%` }} 
                className="w-full bg-amber-400 rounded-t-sm transition-all duration-500"
              />
              {/* Rent Bar */}
              <div 
                style={{ height: `${(m.rent / Math.max(peakCashflow, 1)) * 100}%` }} 
                className="w-full bg-slate-300 rounded-b-sm transition-all duration-500 mt-px"
              />
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-300 rounded-sm" /> Current Rent</div>
          <div className="hidden sm:block">Months 1 to {duration}</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded-sm" /> Loan Interest</div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">
        <strong className="text-slate-900 block mb-1">Consultant Strategy Note:</strong> 
        By month {Math.ceil(duration * 0.8)}, your builder will issue the &apos;Fixing&apos; stage invoice. At this point, you will be paying <strong>${rent.toLocaleString()}</strong> in rent PLUS an estimated <strong>${Math.round(peakInterest).toLocaleString()}</strong> in loan interest simultaneously. Ensure your liquid cash buffer is large enough to sustain this peak cashflow hit before keys are handed over.
      </div>
    </Card>
  );
}