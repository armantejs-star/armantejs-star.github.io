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
  const { 
    activeView, property, establishedProperty, visaStatus, 
    isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance 
  } = current;

  // 1. ISOLATE PATHWAYS
  const isBuild = activeView === 'build';
  const land = isBuild ? (property?.landPrice || 0) : 0;
  const build = isBuild ? (property?.buildPrice || 0) : 0;
  const site = isBuild ? (property?.siteWorks || 0) : 0;
  const nathers = isBuild ? (property?.nathers7StarUpgrade || 0) : 0;
  const soilBuffer = isBuild ? getSoilBuffer(property?.soilClassificationRisk || 'Unknown') : 0;
  
  const totalBuildCost = build + site + nathers + soilBuffer;
  const totalPropertyPrice = isBuild ? (land + totalBuildCost) : (establishedProperty?.purchasePrice || 0);

  // 2. DETECT VISAS & MIXED COUPLES (Smart Logic Synced with Strategy Engine)
  const isTemp = (visa?: string) => {
    if (!visa) return false;
    const permanentVisas = ['Citizen', 'PR', 'Permanent Resident', 'Subclass 189', 'Subclass 190', 'Subclass 801', 'Subclass 820'];
    return !permanentVisas.includes(visa);
  };

  const a1Temp = isTemp(visaStatus?.applicant1?.visa);
  const a2Temp = visaStatus?.applicant2?.visa ? isTemp(visaStatus?.applicant2?.visa) : false;

  const hasTemp = a1Temp || a2Temp;
  const hasPermanent = (!a1Temp && visaStatus?.applicant1?.visa) || (!a2Temp && visaStatus?.applicant2?.visa);
  const isMixedCouple = hasTemp && hasPermanent;

  // 3. TAXES & FIRB
  const stampDuty = isBuild ? calculateSaStampDuty(land, isSaFhbEligible) : calculateSaStampDuty(totalPropertyPrice, false); 
  const foreignSurcharge = totalPropertyPrice * calculateEffectiveSurchargeRate(visaStatus);
  
  // FIRB Fee waived for mixed couples
  const firbFee = (hasTemp && !isMixedCouple) ? 15600 : 0;

  const standardSetupCosts = isBuild 
    ? (conveyancingFees || 0) + (postBuildSetup || 0) + (turnkeyAllowance || 0) + firbFee
    : (conveyancingFees || 0) + (establishedProperty?.renovationBuffer || 0) + firbFee;

  // 4. SEGMENTS
  const segments = [
    { label: isBuild ? 'Land + Build' : 'Property Value', value: totalPropertyPrice, color: 'bg-indigo-500' },
    { label: 'Stamp Duty', value: stampDuty, color: 'bg-emerald-500' },
    { label: 'Foreign Surcharge', value: foreignSurcharge, color: 'bg-amber-500' },
    { label: 'FIRB Fee', value: firbFee, color: 'bg-rose-500' },
    { label: 'Setup / Buffer', value: standardSetupCosts - firbFee, color: 'bg-sky-500' }
  ].filter(s => s.value > 0);

  const totalRequired = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-800">Capital Allocation</h2>
      </div>

      {totalRequired === 0 ? (
        <div className="h-12 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-400">
          Awaiting Data...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Segmented Bar */}
          <div className="h-12 flex rounded-xl overflow-hidden shadow-inner border border-slate-200/50">
            {segments.map((s, idx) => (
              <div 
                key={idx} 
                style={{ width: `${(s.value / totalRequired) * 100}%` }}
                className={`${s.color} h-full transition-all duration-700 ease-out border-r border-white/20 last:border-0 hover:opacity-90`}
                title={`${s.label}: $${s.value.toLocaleString()}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {segments.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className={`w-3 h-3 rounded-full ${s.color} shadow-sm`} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-1">{s.label}</span>
                  <span className="text-sm font-black text-slate-900 leading-none">${Math.round(s.value).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}