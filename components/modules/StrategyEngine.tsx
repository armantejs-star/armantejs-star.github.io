'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

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

  // 2. DETECT VISAS & MIXED COUPLES (Bulletproof Smart Detection)
  const isTemp = (visa?: string) => {
    if (!visa) return false;
    const v = visa.toLowerCase();
    const isPermanent = v.includes('citizen') || v.includes('pr') || v.includes('permanent') || v.includes('189') || v.includes('190') || v.includes('801') || v.includes('820');
    return !isPermanent;
  };

  const a1Visa = visaStatus?.applicant1?.visa;
  const a2Visa = visaStatus?.applicant2?.visa;
  
  const a1Temp = isTemp(a1Visa);
  const a2Temp = a2Visa ? isTemp(a2Visa) : false;

  const hasTemp = a1Temp || a2Temp;
  const hasPermanent = (!a1Temp && a1Visa) || (!a2Temp && a2Visa);
  
  const isMixedCouple = hasTemp && hasPermanent;
  const isStrictlyTemp = hasTemp && !hasPermanent;

  // 3. TAX & FEDERAL LEGISLATION
  const stampDuty = isBuild 
    ? calculateSaStampDuty(land, isSaFhbEligible)
    : calculateSaStampDuty(totalPropertyPrice, false); 
    
  // FHOG requires at least one Citizen/PR
  const fhbGrant = (isBuild && isSaFhbEligible && hasPermanent) ? 15000 : 0;
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;
  
  // FIRB Fee applies to temporary residents, but is WAIVED for mixed couples (joint tenants)
  const firbFee = (hasTemp && !isMixedCouple) ? 15600 : 0;

  // 4. SETUP COSTS
  const totalSetupCosts = isBuild
    ? (conveyancingFees || 0) + (postBuildSetup || 0) + (turnkeyAllowance || 0) + firbFee
    : (conveyancingFees || 0) + (establishedProperty?.renovationBuffer || 0) + firbFee;

  // 5. FINAL TOTALS
  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const targetLoanAmount = Math.max(0, totalFundsRequired - (cashDeposit || 0) - fhbGrant);
  const lvr = totalPropertyPrice > 0 ? (targetLoanAmount / totalPropertyPrice) * 100 : 0;

  // 6. STRATEGIC INFERENCES 
  const advice = [];
  
  // Federal Restrictions (FIRB)
  if (!isBuild && isStrictlyTemp) {
    advice.push({ type: 'critical', text: "FIRB BLOCKER: Temporary residents are strictly restricted from purchasing established properties. You must build new." });
  }

  if (hasTemp && !isMixedCouple) {
    advice.push({ type: 'warning', text: "FIRB Application Fee: A non-refundable fee of $15,600 has been calculated into your setup costs." });
  } else if (isMixedCouple) {
    advice.push({ type: 'good', text: "Spousal FIRB Exemption: Purchasing jointly with a Citizen/PR spouse completely waives the $15,600 FIRB fee." });
  }

  if (isBuild && isStrictlyTemp) {
    advice.push({ type: 'warning', text: "FIRB 4-Year Mandate: Federal law dictates you must complete construction within 4 years of FIRB approval." });
    advice.push({ type: 'critical', text: "Vacancy Penalty: Once built, leaving the property vacant for >6 months in a year triggers a penalty double the FIRB fee." });
  }

  // State Allowances & Taxes (FHOG & Stamp Duty)
  if (isBuild && isSaFhbEligible && hasPermanent) {
    advice.push({ type: 'good', text: "SA FHB Advantage Active: You pay $0 Stamp Duty and receive the $15,000 grant." });
  } else if (isBuild && isSaFhbEligible && !hasPermanent) {
    advice.push({ type: 'warning', text: "FHOG Blocked: SA FHB stamp duty waiver applies, but the $15,000 cash grant requires at least one Citizen/PR." });
  } else if (!isBuild && isSaFhbEligible) {
    advice.push({ type: 'warning', text: "SA FHB Not Applicable: South Australia strictly charges full stamp duty on established homes." });
  }

  // Banking & LVR Restrictions
  if (isStrictlyTemp && lvr > 80) {
    advice.push({ type: 'critical', text: `LMI BLOCKER: At ${lvr.toFixed(1)}% LVR, LMI is required. Australian LMI providers generally reject temporary residents. You must reduce LVR to 80% maximum.` });
  } else if (lvr > 80) {
    advice.push({ type: 'warning', text: `LMI Triggered: At ${lvr.toFixed(1)}% LVR, you will be required to pay Lenders Mortgage Insurance.` });
  } else if (lvr > 0) {
    advice.push({ type: 'good', text: `Healthy LVR: At ${lvr.toFixed(1)}%, you avoid LMI entirely.` });
  }

  if (foreignSurcharge > 0) {
    advice.push({ type: 'warning', text: `Foreign Buyer Surcharge: ${(surchargeRate * 100).toFixed(1)}% applied to the property price.` });
  }

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
            <p className="text-2xl font-black text-emerald-400">
              <AnimatedNumber prefix="$" value={targetLoanAmount} />
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Required</p>
            <p className="text-2xl font-black text-white">
              <AnimatedNumber prefix="$" value={totalFundsRequired} />
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Strategic Inferences</h3>
          <div className="space-y-3">
            {advice.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                {item.type === 'critical' ? (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                ) : item.type === 'good' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span className={item.type === 'critical' ? 'text-red-300 font-bold' : 'text-slate-300'}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}