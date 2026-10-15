'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { calculateFirbFee, calculateEscalatedBuild } from '@/lib/math/advanced';
import { getSoilBuffer } from '@/constants/soil';

// ATO Net Income Helper (Matches your HTML logic)
function calculateNetIncome(gross: number) {
  if (gross <= 0) return 0;
  let tax = 0;
  if (gross > 190000) tax = (gross - 190000) * 0.45 + 51600;
  else if (gross > 135000) tax = (gross - 135000) * 0.37 + 31250;
  else if (gross > 45000) tax = (gross - 45000) * 0.30 + 4288;
  else if (gross > 18200) tax = (gross - 18200) * 0.16;
  return gross - tax - (gross * 0.02); // Includes 2% Medicare
}

export function HealthGauge() {
  const { current } = useAppStore();
  const {
    property, visaStatus, applicant1Income = 80000, applicant2Income = 40000,
    monthlyDebts = 500, cashDeposit = 150000, preBuildDelayMonths = 0,
    builderEscalationPct = 6
  } = current;

  // 1. Calculate Required Loan
  const soilBuffer = getSoilBuffer(property.soilClassificationRisk);
  const buildEscalated = calculateEscalatedBuild(property.buildPrice, preBuildDelayMonths, builderEscalationPct);
  const totalPropertyPrice = property.landPrice + buildEscalated + property.siteWorks + property.nathers7StarUpgrade + soilBuffer;

  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const stampDuty = calculateSaStampDuty(property.landPrice);
  const firbFee = calculateFirbFee(totalPropertyPrice, surchargeRate > 0);
  
  const totalTaxes = stampDuty + (totalPropertyPrice * surchargeRate) + firbFee;
  const totalFundsRequired = totalPropertyPrice + totalTaxes + property.siteWorks + 10000; // Includes setup buffer
  const targetLoanAmount = Math.max(0, totalFundsRequired - cashDeposit);

  // 2. Calculate Max Capacity (APRA 3% Stress Test)
  const netMonthly = (calculateNetIncome(applicant1Income) + calculateNetIncome(applicant2Income)) / 12;
  const surplus = netMonthly - monthlyDebts;
  const assessmentRate = (6.5 + 3) / 100 / 12; 
  
  let maxBorrow = 0;
  if (assessmentRate > 0 && surplus > 0) {
    maxBorrow = surplus * ((Math.pow(1 + assessmentRate, 360) - 1) / (assessmentRate * Math.pow(1 + assessmentRate, 360))) * 0.9;
  }

  // 3. UI Color Logic
  let healthStatus = "✅ COMFORTABLE - Buffer remaining";
  let healthColor = "bg-emerald-500";
  let healthBg = "bg-emerald-50 border-emerald-200";
  let healthText = "text-emerald-700";
  let ratio = maxBorrow > 0 ? targetLoanAmount / maxBorrow : 1.1;

  if (maxBorrow <= 0 || ratio > 1) {
    healthStatus = maxBorrow <= 0 ? "⚠️ FAIL - Insufficient Income" : `🚫 SHORTFALL - Exceeds limit by $${Math.round(targetLoanAmount - maxBorrow).toLocaleString()}`;
    healthColor = "bg-red-500"; healthBg = "bg-red-50 border-red-200"; healthText = "text-red-700";
  } else if (ratio > 0.85) {
    healthStatus = `⚠️ TIGHT - Using ${(ratio * 100).toFixed(1)}% of capacity`;
    healthColor = "bg-amber-500"; healthBg = "bg-amber-50 border-amber-200"; healthText = "text-amber-700";
  }

  const fillPercentage = Math.min(ratio * 100, 100);

  return (
    <Card className="p-6">
      <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        <span>Max Capacity: <strong className="text-slate-900 text-lg block">${Math.round(maxBorrow).toLocaleString('en-AU')}</strong></span>
        <span className="text-right">Required Loan: <strong className="text-slate-900 text-lg block">${Math.round(targetLoanAmount).toLocaleString('en-AU')}</strong></span>
      </div>
      
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${healthColor}`} 
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      
      <div className={`mt-4 text-center font-bold text-sm p-2 rounded-lg border ${healthBg} ${healthText}`}>
        {healthStatus}
      </div>
    </Card>
  );
}