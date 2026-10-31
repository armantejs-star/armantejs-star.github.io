'use client';
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { TrendingUp } from 'lucide-react';

export function OpportunityCostModule() {
  const { current, setAppState } = useAppStore();
  const { activeView, property, establishedProperty, cashDeposit, propertyGrowthPct, etfReturnPct } = current;

  const isBuild = activeView === 'build';
  const land = isBuild ? (property?.landPrice || 0) : 0;
  const totalBuildCost = isBuild ? ((property?.buildPrice || 0) + (property?.siteWorks || 0) + (property?.nathers7StarUpgrade || 0) + getSoilBuffer(property?.soilClassificationRisk || 'Unknown')) : 0;
  
  const totalPropertyPrice = isBuild ? (land + totalBuildCost) : (establishedProperty?.purchasePrice || 0);

  const propRate = (propertyGrowthPct || 5) / 100;
  const etfRate = (etfReturnPct || 7) / 100;

  const propertyFutureValue = totalPropertyPrice * Math.pow(1 + propRate, 5);
  const propertyProfit = propertyFutureValue - totalPropertyPrice;

  const etfFutureValue = (cashDeposit || 0) * Math.pow(1 + etfRate, 5);
  const etfProfit = etfFutureValue - (cashDeposit || 0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-800">5-Year Opportunity Cost</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col space-y-1">
           <label className="text-sm font-medium text-slate-700">Property Growth (%)</label>
           <input
             type="number"
             value={propertyGrowthPct || ''}
             onChange={(e) => setAppState({ propertyGrowthPct: Number(e.target.value) })}
             className="px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
           />
        </div>
        <div className="flex flex-col space-y-1">
           <label className="text-sm font-medium text-slate-700">Index ETF Return (%)</label>
           <input
             type="number"
             value={etfReturnPct || ''}
             onChange={(e) => setAppState({ etfReturnPct: Number(e.target.value) })}
             className="px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
           />
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Leveraged Property Gains</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-indigo-900">+${Math.round(propertyProfit).toLocaleString()}</p>
            <p className="text-xs font-bold text-indigo-700">Asset: ${totalPropertyPrice.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cash in Index ETF</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-slate-900">+${Math.round(etfProfit).toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500">Asset: ${(cashDeposit || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}