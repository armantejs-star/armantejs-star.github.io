'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateBorrowingCapacity, calculateLmi } from '@/lib/math/loan';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { getSoilBuffer } from '@/constants/soil';

export function StrategyEngine() {
  const { current } = useAppStore();
  const { property, visaStatus, applicant1Income, annualLivingExpenses, cashDeposit } = current;

  // Property Costs
  const soilBuffer = getSoilBuffer(property.soilClassificationRisk);
  const totalBuildCost = property.buildPrice + property.siteWorks + property.nathers7StarUpgrade + soilBuffer;
  const totalPropertyPrice = property.landPrice + totalBuildCost;

  // Taxes
  const stampDuty = calculateSaStampDuty(property.landPrice);
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  // Loan & LMI
  const maxBorrowing = calculateBorrowingCapacity(applicant1Income || 0, annualLivingExpenses || 0);
  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge;
  const targetLoanAmount = totalFundsRequired - (cashDeposit || 0);
  const lmi = targetLoanAmount > 0 ? calculateLmi(totalPropertyPrice, targetLoanAmount) : 0;
  
  // Final calculations
  const totalCashNeeded = totalFundsRequired + lmi - maxBorrowing;
  const isShortfall = totalCashNeeded > (cashDeposit || 0);

  // FIX 1: Clean up the Javascript floating point error
  const displaySurchargePercent = parseFloat((surchargeRate * 100).toFixed(2));

  // FIX 2: Use a native <div> instead of <Card> to prevent Tailwind background class clashing
  return (
    <div className="bg-slate-900 rounded-xl border border-emerald-900/50 shadow-xl overflow-hidden p-6 text-slate-50">
      <h2 className="text-xl font-bold text-emerald-400 mb-6 border-b border-slate-700 pb-2">
        Financial Strategy Output
      </h2>

      <div className="space-y-3 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Total Property Value:</span>
          <span>${totalPropertyPrice.toLocaleString('en-AU')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">SA Stamp Duty (Land Only):</span>
          <span>${stampDuty.toLocaleString('en-AU')}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Foreign Surcharge ({displaySurchargePercent}%):</span>
          <span>${foreignSurcharge.toLocaleString('en-AU')}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Estimated LMI:</span>
          <span>${lmi.toLocaleString('en-AU')}</span>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-700 text-emerald-300">
          <span>Maximum Borrowing Capacity:</span>
          <span>${maxBorrowing.toLocaleString('en-AU')}</span>
        </div>

        <div className={`flex justify-between pt-4 border-t border-slate-700 text-lg font-bold ${isShortfall ? 'text-red-400' : 'text-emerald-400'}`}>
          <span>Cash Required to Settle:</span>
          <span>${Math.max(0, totalCashNeeded).toLocaleString('en-AU')}</span>
        </div>
      </div>
    </div>
  );
}