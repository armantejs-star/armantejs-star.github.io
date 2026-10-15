'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { calculateEscalatedBuild } from '@/lib/math/advanced';

export function DrawdownTableModule() {
  const { current } = useAppStore();
  const { property, cashDeposit = 150000 } = current;

  const buildEscalated = calculateEscalatedBuild(
    property.buildPrice,
    current.preBuildDelayMonths ?? 0,
    current.builderEscalationPct ?? 6.0
  );

  const stages = [
    { name: '1. Slab Stage', pct: 20 },
    { name: '2. Frame Stage', pct: 20 },
    { name: '3. Lock-Up Stage', pct: 25 },
    { name: '4. Fixing Stage', pct: 20 },
    { name: '5. Completion Stage', pct: 15 },
  ];

  let cumulativeBuild = 0;
  const landLoan = Math.max(0, property.landPrice - cashDeposit);

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-bold text-slate-800">Progressive Drawdown Schedule</h3>
      <p className="text-xs text-slate-500">*Calculated against the escalated build contract price.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="p-2.5">Stage</th>
              <th className="p-2.5">%</th>
              <th className="p-2.5">Drawn Amount</th>
              <th className="p-2.5">Cumulative Loan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stages.map((stage, idx) => {
              const amount = buildEscalated * (stage.pct / 100);
              cumulativeBuild += amount;
              return (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-800">{stage.name}</td>
                  <td className="p-2.5 text-slate-600">{stage.pct}%</td>
                  <td className="p-2.5 font-mono text-slate-700">${Math.round(amount).toLocaleString('en-AU')}</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-600">
                    ${Math.round(landLoan + cumulativeBuild).toLocaleString('en-AU')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}