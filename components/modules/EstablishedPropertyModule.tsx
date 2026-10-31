'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Tooltip } from '@/components/ui/Tooltip';
import { AlertTriangle, Home } from 'lucide-react';

export function EstablishedPropertyModule() {
  const { current, setAppState } = useAppStore();
  const { establishedProperty, isSaFhbEligible } = current;

  const updateEstablished = (key: string, value: number) => {
    setAppState({
      establishedProperty: {
        ...establishedProperty,
        [key]: value
      }
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Home className="w-5 h-5 text-slate-500" />
          Established Property Details
        </h2>
        <Tooltip text="Enter the baseline costs for buying an existing home. Remember to include strata fees for townhouses or apartments." />
      </div>

      {/* DYNAMIC WARNING ABOUT FHB & STAMP DUTY */}
      {isSaFhbEligible && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-800 shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="text-sm">
            <p className="font-bold">SA First Home Buyer Alert</p>
            <p className="mt-1 opacity-90">
              South Australia&apos;s $15,000 First Home Owner Grant and Stamp Duty Abolition apply <strong className="text-amber-900">strictly to new builds</strong>. By purchasing an established property, your client will be legally liable for standard stamp duty on the full purchase price.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrencyInput
          label="Target Purchase Price"
          value={establishedProperty.purchasePrice || 0}
          onChange={(v) => updateEstablished('purchasePrice', v)}
        />

        <CurrencyInput
          label="Immediate Renovation Buffer"
          value={establishedProperty.renovationBuffer || 0}
          onChange={(v) => updateEstablished('renovationBuffer', v)}
        />

        <CurrencyInput
          label="Yearly Strata / Body Corp ($)"
          value={establishedProperty.strataYearly || 0}
          onChange={(v) => updateEstablished('strataYearly', v)}
        />

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Settlement Timeframe</label>
          <select 
            value={establishedProperty.settlementDays}
            onChange={(e) => updateEstablished('settlementDays', Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 h-10"
          >
            <option value={30}>30 Days (Standard)</option>
            <option value={45}>45 Days</option>
            <option value={60}>60 Days (Extended)</option>
            <option value={90}>90 Days (Subject to Sale)</option>
          </select>
        </div>
      </div>
    </Card>
  );
}