'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { PieChart } from 'lucide-react';

export function CapitalAllocationChart() {
  const { current } = useAppStore();
  const { activeView, property, establishedProperty, visaStatus, isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance } = current;

  const isBuild = activeView === 'build';
  
  const land = isBuild ? (property?.landPrice || 0) : 0;
  const build = isBuild ? (property?.buildPrice || 0) : 0;
  const site = isBuild ? (property?.siteWorks || 0) : 0;
  const nathers = isBuild ? (property?.nathers7StarUpgrade || 0) : 0;
  const soilBuffer = isBuild ? getSoilBuffer(property?.soilClassificationRisk || 'Unknown') : 0;
  
  const totalBuildCost = build + site + nathers + soilBuffer;
  const totalPropertyPrice = isBuild ? (land + totalBuildCost) : (establishedProperty?.purchasePrice || 0);

  const stampDuty = isBuild 
    ? calculateSaStampDuty(land, isSaFhbEligible)
    : calculateSaStampDuty(totalPropertyPrice, false);
    
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  const totalSetupCosts = isBuild
    ? (conveyancingFees || 0) + (postBuildSetup || 0) + (turnkeyAllowance || 0)
    : (conveyancingFees || 0) + (establishedProperty?.renovationBuffer || 0);

  const totalFunds = totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const divisor = totalFunds || 1;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-800">Capital Allocation</h2>
      </div>

      <div className="w-full h-12 flex rounded-lg overflow-hidden shadow-inner mb-6 bg-slate-100">
        {isBuild ? (
          <>
            <div style={{ width: `${(land / divisor) * 100}%` }} className="bg-sky-500 hover:bg-sky-400 transition-colors border-r border-white/20" title="Land" />
            <div style={{ width: `${(totalBuildCost / divisor) * 100}%` }} className="bg-emerald-500 hover:bg-emerald-400 transition-colors border-r border-white/20" title="Build" />
          </>
        ) : (
          <div style={{ width: `${(totalPropertyPrice / divisor) * 100}%` }} className="bg-indigo-500 hover:bg-indigo-400 transition-colors border-r border-white/20" title="Property" />
        )}
        
        <div style={{ width: `${(stampDuty / divisor) * 100}%` }} className="bg-amber-500 hover:bg-amber-400 transition-colors border-r border-white/20" title="Stamp Duty" />
        <div style={{ width: `${(foreignSurcharge / divisor) * 100}%` }} className="bg-red-500 hover:bg-red-400 transition-colors border-r border-white/20" title="Foreign Surcharge" />
        <div style={{ width: `${(totalSetupCosts / divisor) * 100}%` }} className="bg-slate-500 hover:bg-slate-400 transition-colors" title="Setup & Fees" />
      </div>

      <div className="grid grid-cols-2 text-sm gap-y-3 font-medium text-slate-600">
        {isBuild ? (
          <>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500 rounded-sm" /> Land Price</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Construction</div>
          </>
        ) : (
          <div className="flex items-center gap-2 col-span-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm" /> Property Price</div>
        )}
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-sm" /> Stamp Duty</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-500 rounded-sm" /> Setup & Buffers</div>
        {foreignSurcharge > 0 && (
          <div className="flex items-center gap-2 col-span-2"><div className="w-3 h-3 bg-red-500 rounded-sm" /> Foreign Surcharge</div>
        )}
      </div>
    </Card>
  );
}