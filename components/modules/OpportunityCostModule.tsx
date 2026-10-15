'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Tooltip } from '@/components/ui/Tooltip';

export function OpportunityCostModule() {
  const { current, setAppState } = useAppStore();

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Market Growth & Investment Returns</h2>
        <Tooltip text="Compare property market inflation against liquid stock market returns on your cash deposit while waiting for PR." />
      </div>

      <div className="space-y-4">
        <Slider
          label="Est. Property Capital Growth"
          value={current.propertyGrowthPct ?? 5.0}
          min={0}
          max={15}
          onChange={(v) => setAppState({ propertyGrowthPct: v })}
          valueLabel="%/yr"
        />

        <Slider
          label="Est. ETF / Stock Return on Cash"
          value={current.etfReturnPct ?? 7.0}
          min={0}
          max={15}
          onChange={(v) => setAppState({ etfReturnPct: v })}
          valueLabel="%/yr"
        />
      </div>
    </Card>
  );
}