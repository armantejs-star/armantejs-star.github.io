'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Tooltip } from '@/components/ui/Tooltip';

export function AdvancedInputsModule() {
  const { current, setAppState } = useAppStore();

  const updateState = (key: string, value: number) => {
    setAppState({ [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Advanced Build & Holding Costs</h2>
        <Tooltip text="Factor in land titling delays, builder price escalations, contingency buffers, and ongoing holding expenses during construction." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Pre-Build Delay (Months)
          </label>
          <input
            type="number"
            value={current.preBuildDelayMonths ?? 0}
            onChange={(e) => updateState('preBuildDelayMonths', Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Builder Price Escalation (%/yr)
          </label>
          <input
            type="number"
            step="0.1"
            value={current.builderEscalationPct ?? 6.0}
            onChange={(e) => updateState('builderEscalationPct', Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Contingency Buffer (%)
          </label>
          <input
            type="number"
            value={current.contingencyPct ?? 10}
            onChange={(e) => updateState('contingencyPct', Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
          />
        </div>

        <CurrencyInput
          label="Post-Build Setup (Driveway, Fencing)"
          value={current.postBuildSetup ?? 10000}
          onChange={(v) => updateState('postBuildSetup', v)}
        />

        <CurrencyInput
          label="Current Monthly Rent"
          value={current.currentMonthlyRent ?? 2200}
          onChange={(v) => updateState('currentMonthlyRent', v)}
        />

        <CurrencyInput
          label="Council & Water Rates ($/yr)"
          value={current.councilRatesYearly ?? 3200}
          onChange={(v) => updateState('councilRatesYearly', v)}
        />
      </div>
    </Card>
  );
}