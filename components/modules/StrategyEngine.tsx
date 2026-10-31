'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';

export function StrategyEngine() {
  const { current } = useAppStore();
  const { 
    activeView, property, establishedProperty, visaStatus, 
    cashDeposit, isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance 
  } = current;

  // 1. ISOLATE THE MATH PATHWAYS
  const isBuild = activeView === 'build';
  
  const land = isBuild ? (property?.landPrice || 0) : 0;
  const build = isBuild ? (property?.buildPrice || 0) : 0;
  const site = isBuild ? (property?.siteWorks || 0) : 0;
  const nathers = isBuild ? (property?.nathers7StarUpgrade || 0) : 0;
  const soilBuffer = isBuild ? getSoilBuffer(property?.soilClassificationRisk || 'Unknown') : 0;
  
  const totalBuildCost = build + site + nathers + soilBuffer;
  const totalPropertyPrice = isBuild ? (land + totalBuildCost) : (establishedProperty?.purchasePrice || 0);

  // 2. SOUTH AUSTRALIA TAX LEGISLATION
  // FHB Stamp Duty Abolition ONLY applies to new builds. Established forces standard duty.
  const stampDuty = isBuild 
    ? calculateSaStampDuty(land, isSaFhbEligible)
    : calculateSaStampDuty(totalPropertyPrice, false); 
    
  const fhbGrant = (isBuild && isSaFhbEligible) ? 15000 : 0;
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  // 3. SETUP COSTS
  const totalSetupCosts = isBuild
    ? (conveyancingFees || 0) + (postBuildSetup || 0) + (turnkeyAllowance || 0)
    : (conveyancingFees || 0) + (establishedProperty?.renovationBuffer || 0);

  // 4. FINAL TOTALS
  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const targetLoanAmount = Math.max(0, totalFundsRequired - (cashDeposit || 0) - fhbGrant);
  const lvr = totalPropertyPrice > 0 ? (targetLoanAmount / totalPropertyPrice) * 100 : 0;

  // 5. STRATEGIC INFERENCES
  const advice = [];
  if (isBuild && isSaFhbEligible) {
    advice.push({ type: 'good', text: "SA FHB Advantage Active: You pay $0 Stamp Duty and receive the $15,000 grant." });
  } else if (!isBuild && isSaFhbEligible) {
    advice.push({ type: 'warning', text: "SA FHB Not Applicable: You selected FHB, but South Australia strictly charges full stamp duty on established homes." });
  }

  if (lvr > 80) advice.push({ type: 'warning', text: `LMI Triggered: At ${lvr.toFixed(1)}% LVR, you will be required to pay Lenders Mortgage Insurance.` });
  else if (lvr > 0) advice.push({ type: 'good', text: `Healthy LVR: At ${lvr.toFixed(1)}%, you avoid LMI entirely.` });

  if (foreignSurcharge > 0) advice.push({ type: 'warning', text: `Foreign Buyer Surcharge: ${(surchargeRate * 100).toFixed(1)}% applied to the property price.` });

  return (
    <Card className="p-6 bg-slate-900 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
        <Calculator className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-bold">Strategy Engine</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Loan</p>
            <p className="text-2xl font-black text-emerald-400">${targetLoanAmount.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Required</p>
            <p className="text-2xl font-black text-white">${totalFundsRequired.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Strategic Inferences</h3>
          <div className="space-y-3">
            {advice.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                {item.type === 'good' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span className="text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}