'use client';

import { ExportPDFButton } from '@/components/modules/ExportPDFButton';
import { RefundVisualizer } from '@/components/modules/RefundVisualizer';
import { SpousalVisaMatrix } from '@/components/modules/SpousalVisaMatrix';
import { PropertyBuildModule } from '@/components/modules/PropertyBuildModule';
import { IncomeDepositModule } from '@/components/modules/IncomeDepositModule';
import { StrategyEngine } from '@/components/modules/StrategyEngine';
import { RepaymentModule } from '@/components/modules/RepaymentModule';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { current } = useAppStore();

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto space-y-8 print:space-y-4">
        
        {/* Header Section with the new Export Button */}
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 print:flex-row print:mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">SA Property Strategy Engine</h1>
            <p className="text-slate-600 mt-2 print:hidden">
              Adjust your scenario parameters below to see live calculations.
            </p>
          </div>
          
          {/* The button will hide itself when printing! */}
          <ExportPDFButton />
        </div>

        {/* Two-Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          
          {/* Left Column: Input Modules */}
          <div className="lg:col-span-7 space-y-6 print:space-y-4">
            <SpousalVisaMatrix />
            <PropertyBuildModule />
            <IncomeDepositModule />
            <RefundVisualizer />
            <RepaymentModule />
          </div>

          {/* Right Column: Live Output Engine */}
          <div className="lg:col-span-5 print:mt-8">
            {/* The sticky class keeps it pinned to the top as you scroll down */}
            <div className="sticky top-6 print:static">
              <StrategyEngine />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}