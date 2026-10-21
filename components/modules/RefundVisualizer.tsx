'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Tooltip } from '@/components/ui/Tooltip';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { calculatePrRefundPotential } from '@/lib/math/prRefund';
import { getSoilBuffer } from '@/constants/soil';

export function RefundVisualizer() {
  const { current, setAppState } = useAppStore();
  const { property, visaStatus, expectedPRWaitMonths } = current;

  // 1. Re-calculate the exact surcharge paid
  const soilBuffer = getSoilBuffer(property.soilClassificationRisk);
  const totalBuildCost = property.buildPrice + property.siteWorks + property.nathers7StarUpgrade + soilBuffer;
  const totalPropertyPrice = property.landPrice + totalBuildCost;
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const foreignSurchargePaid = totalPropertyPrice * surchargeRate;

  // 2. Run it through our PR Refund Engine
  const refundAmount = calculatePrRefundPotential(foreignSurchargePaid, expectedPRWaitMonths);
  const isEligible = refundAmount > 0;

  // 3. Smart UI: If they don't have to pay a surcharge (e.g., they are Citizens), 
  // we completely hide this module so we don't clutter the screen!
  if (foreignSurchargePaid === 0) return null;

  return (
    <Card className="p-6 space-y-6 border-emerald-200 bg-emerald-50/30">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            RevenueSA PR Refund Strategy
            <Tooltip text="If you receive your Permanent Residency within 12 months of property settlement, SA Revenue will refund your foreign surcharge in full." />
          </h2>
          <p className="text-sm text-slate-600 mt-1">Plan your visa timeline to reclaim your taxes.</p>
        </div>
      </div>

      <Slider
        label="Expected PR Grant (Wait Time)"
        value={expectedPRWaitMonths}
        min={0}
        max={120}
        onChange={(v) => setAppState({ expectedPRWaitMonths: v })}
        valueLabel="Months"
      />

      <div className={`p-4 rounded-lg border transition-colors duration-300 ${isEligible ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
        <div className="flex justify-between items-center">
          <span className="font-semibold">
            {isEligible ? 'Eligible for Full Refund!' : 'Refund Window Expired'}
          </span>
          <span className="text-2xl font-bold font-mono tracking-tight">
            ${refundAmount.toLocaleString('en-AU')}
          </span>
        </div>
        <p className="text-sm mt-2 opacity-90">
          {isEligible 
            ? "Your expected PR grant falls within the 12-month RevenueSA window. You can claim this cash back after settlement." 
            : "Your expected PR grant is over 12 months post-settlement. The surcharge will be a permanently sunk cost."}
        </p>
      </div>
    </Card>
  );
}