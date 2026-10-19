'use client';

import React, { useState, useEffect } from 'react';
import { ExportPDFButton } from '@/components/modules/ExportPDFButton';
import { ExportCSVButton } from '@/components/modules/ExportCSVButton';
import { InstallButton } from '@/components/ui/InstallButton';
import { RefundVisualizer } from '@/components/modules/RefundVisualizer';
import { SpousalVisaMatrix } from '@/components/modules/SpousalVisaMatrix';
import { PropertyBuildModule } from '@/components/modules/PropertyBuildModule';
import { IncomeDepositModule } from '@/components/modules/IncomeDepositModule';
import { AdvancedInputsModule } from '@/components/modules/AdvancedInputsModule';
import { OpportunityCostModule } from '@/components/modules/OpportunityCostModule';
import { StrategyEngine } from '@/components/modules/StrategyEngine';
import { RepaymentModule } from '@/components/modules/RepaymentModule';
import { CapitalAllocationChart } from '@/components/modules/CapitalAllocationChart';
import { DrawdownTableModule } from '@/components/modules/DrawdownTableModule';
import { KnowledgeBaseDrawer } from '@/components/modules/KnowledgeBaseDrawer';
import { HealthGauge } from '@/components/modules/HealthGauge';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const { setKnowledgeBaseOpen } = useAppStore();
  
  const [isAwake, setIsAwake] = useState(false);
  
  // THE FIX: Adding a tiny timeout satisfies the strict React rules
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAwake(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isAwake) {
    return <div className="min-h-screen bg-slate-50"></div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32 print:bg-white print:p-0 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 print:space-y-4">
        
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 print:flex-row print:mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Broke Builder</h1>
            <p className="text-slate-600 mt-2 print:hidden">
              Comprehensive Property, Construction & Financial Strategy Engine
            </p>
          </div>

          <button 
            onClick={() => setKnowledgeBaseOpen(true)}
            className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-200 transition-colors shadow-sm"
          >
            <BookOpen className="w-5 h-5" />
            <span>How To Use</span>
          </button>
          
          <div className="flex gap-3 print:hidden">
            <InstallButton />
            <ExportCSVButton />
            <ExportPDFButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          <div className="lg:col-span-7 space-y-6 print:space-y-4">
            <SpousalVisaMatrix />
            <PropertyBuildModule />
            <AdvancedInputsModule />
            <IncomeDepositModule />
            <OpportunityCostModule />
            <RefundVisualizer />
            <RepaymentModule />
          </div>

          <div className="lg:col-span-5 space-y-6 print:mt-8 h-fit">
            <HealthGauge />
            <StrategyEngine />
            <CapitalAllocationChart />
            <DrawdownTableModule />
          </div>
        </div>
      </div>

      <KnowledgeBaseDrawer />
    </main>
  );
}