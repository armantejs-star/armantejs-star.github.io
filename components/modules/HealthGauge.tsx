'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { Activity } from 'lucide-react';

export function HealthGauge() {
  const { current } = useAppStore();
  const { activeView, property, establishedProperty, visaStatus, cashDeposit, isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance } = current;

  const isBuild = activeView === 'build';
  const land = isBuild ? (property?.landPrice || 0) : 0;
  const build = isBuild ? (property?.buildPrice || 0) : 0;
  const site = isBuild ? (property?.siteWorks || 0) : 0;
  const nathers = isBuild ? (property?.nathers7StarUpgrade || 0) : 0;
  const soilBuffer = isBuild ? getSoilBuffer(property?.soilClassificationRisk || 'Unknown') : 0;
  
  const totalPropertyPrice = isBuild ? (land + build + site + nathers + soilBuffer) : (establishedProperty?.purchasePrice || 0);

  const stampDuty = isBuild ? calculateSaStampDuty(land, isSaFhbEligible) : calculateSaStampDuty(totalPropertyPrice, false);
  const fhbGrant = (isBuild && isSaFhbEligible) ? 15000 : 0;
  const foreignSurcharge = totalPropertyPrice * calculateEffectiveSurchargeRate(visaStatus);
  const totalSetupCosts = isBuild ? ((conveyancingFees||0) + (postBuildSetup||0) + (turnkeyAllowance||0)) : ((conveyancingFees||0) + (establishedProperty?.renovationBuffer||0));

  const totalFunds = totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const targetLoanAmount = Math.max(0, totalFunds - (cashDeposit || 0) - fhbGrant);
  const lvr = totalPropertyPrice > 0 ? (targetLoanAmount / totalPropertyPrice) * 100 : 0;

  let healthColor = 'text-emerald-500';
  if (lvr > 80) healthColor = 'text-amber-500';
  if (lvr > 90) healthColor = 'text-red-500';

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-800">LVR Health</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-4">
        <span className={`text-5xl font-black ${healthColor}`}>{lvr.toFixed(1)}%</span>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Estimated LVR</span>
      </div>
    </Card>
  );
}