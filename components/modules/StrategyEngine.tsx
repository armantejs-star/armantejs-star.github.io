'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { getSoilBuffer } from '@/constants/soil';
import { calculateFirbFee, calculateEscalatedBuild, calculateEtfOpportunity } from '@/lib/math/advanced';

export function StrategyEngine() {
  const { current } = useAppStore();
  const {
    property, visaStatus, expectedPRWaitMonths,
    propertyGrowthPct = 5, etfReturnPct = 7, currentMonthlyRent = 2200,
    preBuildDelayMonths = 0, builderEscalationPct = 6, contingencyPct = 10, postBuildSetup = 10000
  } = current;

  // 1. Property & Build Calculations
  const soilBuffer = getSoilBuffer(property.soilClassificationRisk);
  const buildEscalated = calculateEscalatedBuild(property.buildPrice, preBuildDelayMonths, builderEscalationPct);
  const totalPropertyPrice = property.landPrice + buildEscalated + property.siteWorks + property.nathers7StarUpgrade + soilBuffer;

  // 2. Tax Calculations
  const stampDuty = calculateSaStampDuty(property.landPrice);
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;
  const firbFee = calculateFirbFee(totalPropertyPrice, surchargeRate > 0);
  const isFHB = visaStatus.applicant1.isFirstHomeBuyer;

  // 3. Strategy Math (Buy Now vs Wait for PR)
  const totalTaxes = stampDuty + foreignSurcharge + firbFee;
  const siteAndContingency = property.siteWorks + ((buildEscalated + property.siteWorks) * (contingencyPct / 100)) + postBuildSetup;
  const upfrontCashNeeded = totalTaxes + siteAndContingency + (totalPropertyPrice * 0.2); // Baseline 20% deposit

  const buyNowTotal = totalPropertyPrice + foreignSurcharge + firbFee + stampDuty;
  
  // Future state if they wait for PR
  const futureProperty = totalPropertyPrice * Math.pow(1 + (propertyGrowthPct / 100 / 12), expectedPRWaitMonths);
  const waitRentPaid = currentMonthlyRent * expectedPRWaitMonths;
  const waitStamp = isFHB ? 0 : calculateSaStampDuty(property.landPrice * Math.pow(1 + (propertyGrowthPct / 100 / 12), expectedPRWaitMonths)); 
  const investmentGain = calculateEtfOpportunity(upfrontCashNeeded, expectedPRWaitMonths, etfReturnPct);
  
  const waitTotal = futureProperty + waitStamp + waitRentPaid - investmentGain;
  const diff = waitTotal - buyNowTotal;
  const buyNowIsBetter = diff > 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Core Financial Receipt */}
      <div className="bg-slate-900 rounded-xl border border-emerald-900/50 shadow-xl overflow-hidden p-6 text-slate-50">
        <h2 className="text-xl font-bold text-emerald-400 mb-6 border-b border-slate-700 pb-2">
          Financial Strategy Output
        </h2>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Property Value (Escalated):</span>
            <span>${Math.round(totalPropertyPrice).toLocaleString('en-AU')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">SA Stamp Duty (Land Only):</span>
            <span>${Math.round(stampDuty).toLocaleString('en-AU')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Foreign Surcharge:</span>
            <span>${Math.round(foreignSurcharge).toLocaleString('en-AU')}</span>
          </div>
          <div className="flex justify-between font-bold text-emerald-300 pt-3 border-t border-slate-700">
            <span>FIRB Application Fee:</span>
            <span>${Math.round(firbFee).toLocaleString('en-AU')}</span>
          </div>
        </div>
      </div>

      {/* 2. Buy Now vs Wait Strategy Box */}
      <div className="bg-slate-900 rounded-xl border border-blue-900/50 shadow-xl overflow-hidden p-6 text-slate-50">
        <h3 className="text-lg font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">
          Buy Now vs. Wait for PR ⚖️
        </h3>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-1">Buy Today on Current Visa</h4>
            <p className="text-2xl font-bold">${Math.round(buyNowTotal).toLocaleString('en-AU')}</p>
            <span className="text-xs text-slate-500">Property + Surcharge + FIRB + Stamp</span>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-1">Wait {expectedPRWaitMonths} Months for PR</h4>
            <p className="text-2xl font-bold">${Math.round(waitTotal).toLocaleString('en-AU')}</p>
            <span className="text-xs text-slate-500 flex justify-between mt-1">
              <span>Inflated Price + Rent Paid</span>
              <span className="text-emerald-400 font-bold">- ${Math.round(investmentGain).toLocaleString('en-AU')} ETF Gain</span>
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg font-bold text-center border ${buyNowIsBetter ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-amber-900/30 text-amber-400 border-amber-800'}`}>
          {buyNowIsBetter 
            ? `✅ Buying NOW is better by $${Math.round(Math.abs(diff)).toLocaleString('en-AU')}` 
            : `⏳ WAITING for PR is better by $${Math.round(Math.abs(diff)).toLocaleString('en-AU')}`}
        </div>
      </div>

    </div>
  );
}