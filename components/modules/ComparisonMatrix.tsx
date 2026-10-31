'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { Scale, Building, Home, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export function ComparisonMatrix() {
  const { current } = useAppStore();
  const { 
    property, establishedProperty, visaStatus, cashDeposit, 
    isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance,
    buildDurationMonths, preBuildDelayMonths
  } = current;

  // --- 1. BUILD MATH ---
  const buildLand = property?.landPrice || 0;
  const buildContract = (property?.buildPrice || 0) + (property?.siteWorks || 0) + (property?.nathers7StarUpgrade || 0) + getSoilBuffer(property?.soilClassificationRisk || 'Unknown');
  const buildTotalProperty = buildLand + buildContract;
  
  const buildStampDuty = calculateSaStampDuty(buildLand, isSaFhbEligible);
  const buildFhbGrant = isSaFhbEligible ? 15000 : 0;
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const buildSurcharge = buildTotalProperty * surchargeRate;
  
  const buildSetup = (conveyancingFees || 0) + (postBuildSetup || 0) + (turnkeyAllowance || 0);
  const buildTotalFunds = buildTotalProperty + buildStampDuty + buildSurcharge + buildSetup;
  const buildTargetLoan = Math.max(0, buildTotalFunds - (cashDeposit || 0) - buildFhbGrant);
  const buildLvr = buildTotalProperty > 0 ? (buildTargetLoan / buildTotalProperty) * 100 : 0;
  const buildTimeframe = (buildDurationMonths || 9) + (preBuildDelayMonths || 0);

  // --- 2. ESTABLISHED MATH ---
  const estPrice = establishedProperty?.purchasePrice || 0;
  const estStampDuty = calculateSaStampDuty(estPrice, false); // SA FHB NEVER applies to established
  const estSurcharge = estPrice * surchargeRate;
  
  const estSetup = (conveyancingFees || 0) + (establishedProperty?.renovationBuffer || 0);
  const estTotalFunds = estPrice + estStampDuty + estSurcharge + estSetup;
  const estTargetLoan = Math.max(0, estTotalFunds - (cashDeposit || 0));
  const estLvr = estPrice > 0 ? (estTargetLoan / estPrice) * 100 : 0;
  const estTimeframeDays = establishedProperty?.settlementDays || 30;

  // --- 3. COMPARISON LOGIC ---
  const stampDutyDiff = estStampDuty - buildStampDuty;
  const loanDiff = Math.abs(estTargetLoan - buildTargetLoan);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Scale className="w-8 h-8 text-indigo-400" />
            Side-by-Side Matrix
          </h2>
          <p className="text-indigo-200 mt-1 text-sm">
            Objective financial variance between building new and buying established in SA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUMN 1: BUILD NEW */}
        <Card className="p-0 overflow-hidden border-2 border-slate-200">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg"><Building className="w-5 h-5 text-white" /></div>
            <h3 className="text-lg font-bold text-slate-900">Build New</h3>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Property Value</p>
              <p className="text-2xl font-black text-slate-900">${buildTotalProperty.toLocaleString()}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${buildStampDuty === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-500 uppercase">Stamp Duty Paid</p>
              <p className={`text-xl font-bold ${buildStampDuty === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                ${buildStampDuty.toLocaleString()}
              </p>
              {isSaFhbEligible && buildStampDuty === 0 && (
                <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SA FHB Exemption Applied
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Target Loan</p>
              <p className="text-xl font-bold text-slate-700">${buildTargetLoan.toLocaleString()}</p>
              <p className={`text-sm font-bold mt-1 ${buildLvr > 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {buildLvr.toFixed(1)}% LVR
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time to Move-In</p>
              <p className="font-semibold text-slate-700">{buildTimeframe} Months</p>
            </div>
          </div>
        </Card>

        {/* COLUMN 2: BUY ESTABLISHED */}
        <Card className="p-0 overflow-hidden border-2 border-slate-200">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg"><Home className="w-5 h-5 text-white" /></div>
            <h3 className="text-lg font-bold text-slate-900">Buy Established</h3>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Target Purchase Price</p>
              <p className="text-2xl font-black text-slate-900">${estPrice.toLocaleString()}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-xs font-bold text-red-400 uppercase">Stamp Duty Paid</p>
              <p className="text-xl font-bold text-red-700">${estStampDuty.toLocaleString()}</p>
              {isSaFhbEligible && (
                <p className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> No FHB Concessions Allowed
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Target Loan</p>
              <p className="text-xl font-bold text-slate-700">${estTargetLoan.toLocaleString()}</p>
              <p className={`text-sm font-bold mt-1 ${estLvr > 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {estLvr.toFixed(1)}% LVR
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time to Move-In</p>
              <p className="font-semibold text-slate-700">{estTimeframeDays} Days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* THE VERDICT ROW */}
      <Card className="p-6 border-l-4 border-l-indigo-500">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Strategic Variance Breakdown</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 text-center md:text-left">
            <p className="text-slate-600 font-medium">
              Buying established will cost an additional <strong className="text-red-600">${stampDutyDiff.toLocaleString()}</strong> in non-recoverable state taxes (Stamp Duty) compared to building new.
            </p>
          </div>
          <div className="hidden md:block">
            <ArrowRight className="w-6 h-6 text-slate-300" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-slate-600 font-medium">
              The target loan for {estTargetLoan > buildTargetLoan ? 'buying established' : 'building new'} is <strong className="text-slate-900">${loanDiff.toLocaleString()}</strong> higher, impacting monthly repayment serviceability.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}