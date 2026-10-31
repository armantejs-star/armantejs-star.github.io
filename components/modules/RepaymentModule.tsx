'use client';
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { Calculator } from 'lucide-react';

export function RepaymentModule() {
  const { current, setAppState } = useAppStore();
  const { 
    activeView, property, establishedProperty, visaStatus, cashDeposit, 
    isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance, 
    loanTermYears, repaymentType 
  } = current;

  // 1. ISOLATE THE MATH PATHWAYS
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

  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const targetLoanAmount = Math.max(0, totalFundsRequired - (cashDeposit || 0) - fhbGrant);

  // 2. LOAN MATH
  const monthlyRate = (6.0 / 100) / 12;
  const termYears = loanTermYears || 30;
  const termMonths = termYears * 12;
  const rType = repaymentType || 'PI';

  let monthlyRepayment = 0;
  if (targetLoanAmount > 0) {
    if (rType === 'IO') {
      monthlyRepayment = targetLoanAmount * monthlyRate;
    } else {
      monthlyRepayment = (targetLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-800">Repayment Strategy</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="flex flex-col space-y-1">
           <label className="text-sm font-medium text-slate-700">Loan Term</label>
           <select
             value={termYears}
             onChange={(e) => setAppState({ loanTermYears: Number(e.target.value) })}
             className="px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
           >
             <option value={30}>30 Years</option>
             <option value={25}>25 Years</option>
           </select>
         </div>
         <div className="flex flex-col space-y-1">
           <label className="text-sm font-medium text-slate-700">Repayment Type</label>
           <select
             value={rType}
             onChange={(e) => setAppState({ repaymentType: e.target.value as 'PI'|'IO' })}
             className="px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
           >
             <option value="PI">Principal & Interest</option>
             <option value="IO">Interest Only</option>
           </select>
         </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Monthly Repayment</p>
        <p className="text-3xl font-black text-slate-900">${Math.round(monthlyRepayment).toLocaleString()}</p>
        <p className="text-xs text-slate-500 mt-2 font-medium">Assumes 6.0% interest rate on a ${targetLoanAmount.toLocaleString()} loan.</p>
      </div>
    </Card>
  );
}