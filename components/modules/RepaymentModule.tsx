'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';

export function RepaymentModule() {
  const { current } = useAppStore();
  const { property, visaStatus, cashDeposit } = current;

  // 1. Re-calculate the target loan amount
  const soilBuffer = getSoilBuffer(property.soilClassificationRisk);
  const totalBuildCost = property.buildPrice + property.siteWorks + property.nathers7StarUpgrade + soilBuffer;
  const totalPropertyPrice = property.landPrice + totalBuildCost;

  const stampDuty = calculateSaStampDuty(property.landPrice);
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge;
  const targetLoanAmount = Math.max(0, totalFundsRequired - (cashDeposit || 0));

  // Local state specifically for this component to slide the interest rate
  const [interestRate, setInterestRate] = useState(6); // Default 6%

  // 2. Standard 30-Year Amortization Math (360 months)
  const monthlyRate = (interestRate / 100) / 12;
  const totalPayments = 360;
  
  let monthlyRepayment = 0;
  if (targetLoanAmount > 0 && monthlyRate > 0) {
    monthlyRepayment = (targetLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  }

  // If they don't need a loan, we hide the module completely
  if (targetLoanAmount === 0) return null;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Estimated Repayments</h2>
        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          30 Year Term
        </span>
      </div>

      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
        <span className="text-slate-600">Required Loan Amount:</span>
        <span className="text-lg font-bold text-slate-900">
          ${targetLoanAmount.toLocaleString('en-AU')}
        </span>
      </div>

      <Slider
        label="Interest Rate"
        value={interestRate}
        min={1}
        max={12}
        onChange={(v) => setInterestRate(v)}
        valueLabel="%"
      />

      <div className="pt-2 flex justify-between items-center text-lg border-t border-slate-100 mt-4">
        <span className="font-semibold text-slate-700">Monthly Repayment:</span>
        <span className="font-bold text-emerald-600 font-mono tracking-tight text-2xl">
          ${Math.round(monthlyRepayment).toLocaleString('en-AU')}
          <span className="text-sm text-slate-400 font-sans ml-1">/mo</span>
        </span>
      </div>
    </Card>
  );
}