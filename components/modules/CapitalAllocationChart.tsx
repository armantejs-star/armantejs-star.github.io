'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';
import { calculateFirbFee, calculateEscalatedBuild, calculateHoldingCosts } from '@/lib/math/advanced';
import { getSoilBuffer } from '@/constants/soil';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

export function CapitalAllocationChart() {
  const { current } = useAppStore();
  const { property, visaStatus } = current;

  const soilBuffer = getSoilBuffer(property.soilClassificationRisk);
  const buildEscalated = calculateEscalatedBuild(
    property.buildPrice,
    current.preBuildDelayMonths ?? 0,
    current.builderEscalationPct ?? 6.0
  );
  const totalProperty = property.landPrice + buildEscalated + property.siteWorks + property.nathers7StarUpgrade + soilBuffer;

  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  const isTempResident = surchargeRate > 0;
  const firbFee = calculateFirbFee(totalProperty, isTempResident);
  const stampDuty = calculateSaStampDuty(property.landPrice);
  const totalTaxes = stampDuty + (totalProperty * surchargeRate) + firbFee;

  const holding = calculateHoldingCosts(
    Math.max(0, property.landPrice - (current.cashDeposit ?? 150000)),
    Math.max(0, totalProperty - (current.cashDeposit ?? 150000)),
    current.preBuildDelayMonths ?? 0,
    9,
    6.5,
    current.currentMonthlyRent ?? 2200,
    current.councilRatesYearly ?? 3200
  );

  const siteSetup = property.siteWorks + ((buildEscalated + property.siteWorks) * ((current.contingencyPct ?? 10) / 100)) + (current.postBuildSetup ?? 10000);

  const data = {
    labels: ['Property', 'Taxes & FIRB', 'Holding Costs', 'Site & Setup'],
    datasets: [
      {
        label: 'Cost ($ AUD)',
        data: [totalProperty, totalTaxes, holding.grandTotal, siteSetup],
        backgroundColor: ['#2563eb', '#dc2626', '#f59e0b', '#8b5cf6'],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Capital Allocation Breakdown</h3>
      <div className="h-64 relative">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}