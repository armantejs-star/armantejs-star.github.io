'use client';

import { RefundVisualizer } from '@/components/modules/RefundVisualizer';
import { SpousalVisaMatrix } from '@/components/modules/SpousalVisaMatrix';
import { PropertyBuildModule } from '@/components/modules/PropertyBuildModule';
import { IncomeDepositModule } from '@/components/modules/IncomeDepositModule';
import { StrategyEngine } from '@/components/modules/StrategyEngine';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { current } = useAppStore();

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SA Property Strategy Engine</h1>
          <p className="text-slate-600 mt-2">Adjust your scenario parameters below to see live calculations.</p>
        </div>

        {/* Two-Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Modules (Takes up 7/12 of the screen) */}
          <div className="lg:col-span-7 space-y-6">
            <SpousalVisaMatrix />
            <PropertyBuildModule />
            <IncomeDepositModule />
            
            {/* The new Refund Visualizer is added right here! */}
            <RefundVisualizer />
            
          </div>

          {/* Right Column: Live Output Engine (Takes up 5/12 of the screen) */}
          <div className="lg:col-span-5">
            {/* The sticky class keeps it pinned to the top as you scroll down */}
            <div className="sticky top-6">
              <StrategyEngine />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}