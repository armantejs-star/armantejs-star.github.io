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
import { ConstructionStressModule } from '@/components/modules/ConstructionStressModule';
import { EstablishedPropertyModule } from '@/components/modules/EstablishedPropertyModule';
import { ComparisonMatrix } from '@/components/modules/ComparisonMatrix';
import { JourneyTracker } from '@/components/modules/JourneyTracker';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen, Building, Home as HomeIcon, Scale } from 'lucide-react';

export default function Home() {
  const { current, setAppState, setKnowledgeBaseOpen } = useAppStore();
  const { activeView } = current;
  
  const [isAwake, setIsAwake] = useState(false);
  
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
    <main className="min-h-screen bg-slate-50 pb-32 print:bg-white print:pb-0 relative overflow-x-hidden">
      
      {/* --- STICKY GLASSMORPHIC HEADER --- */}
      <div className="sticky top-0 z-40 w-full bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6">
          
          {/* Top Branding & Tools Bar */}
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Broke Builder</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">
                Premium Property & Financial Strategy Engine
              </p>
            </div>

            <div className="flex gap-2 md:gap-3 flex-wrap">
              <button 
                onClick={() => setKnowledgeBaseOpen(true)}
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs md:text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Documentation</span>
              </button>
              <InstallButton />
              <ExportCSVButton />
              <ExportPDFButton />
            </div>
          </div>

          {/* Journey Tracker Pipeline */}
          <div className="-mx-4 md:-mx-8">
            <JourneyTracker />
          </div>

          {/* FotMob Pill Tabs */}
          <div className="py-4">
            <div className="bg-slate-200/70 p-1.5 rounded-full flex flex-col sm:flex-row gap-1 shadow-inner max-w-2xl mx-auto">
              <button
                onClick={() => setAppState({ activeView: 'build' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeView === 'build' ? 'bg-slate-900 text-white shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Building className="w-4 h-4" />
                Build New
              </button>
              
              <button
                onClick={() => setAppState({ activeView: 'established' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeView === 'established' ? 'bg-slate-900 text-white shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                Buy Established
              </button>

              <button
                onClick={() => setAppState({ activeView: 'compare' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeView === 'compare' ? 'bg-indigo-600 text-white shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Scale className="w-4 h-4" />
                Compare Options
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- SCROLLING CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 print:p-0 print:space-y-4">
        
        {/* Global Client Profile */}
        <div className="print:block space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-200 pb-2">Global Client Profile</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncomeDepositModule />
            <SpousalVisaMatrix />
          </div>
        </div>
        
        {/* VIEW: BUILD */}
        {activeView === 'build' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
            <div className="lg:col-span-7 space-y-6 print:space-y-4">
              <PropertyBuildModule />
              <ConstructionStressModule />
              <AdvancedInputsModule />
              <RefundVisualizer />
              <OpportunityCostModule />
              <RepaymentModule />
            </div>
            <div className="lg:col-span-5 space-y-6 print:mt-8 h-fit">
              <HealthGauge />
              <StrategyEngine />
              <CapitalAllocationChart />
              <DrawdownTableModule />
            </div>
          </div>
        )}

        {/* VIEW: ESTABLISHED */}
        {activeView === 'established' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
            <div className="lg:col-span-7 space-y-6 print:space-y-4">
              <EstablishedPropertyModule />
              <RefundVisualizer />
              <OpportunityCostModule />
              <RepaymentModule />
            </div>
            <div className="lg:col-span-5 space-y-6 print:mt-8 h-fit">
              <HealthGauge />
              <StrategyEngine />
              <CapitalAllocationChart />
            </div>
          </div>
        )}

        {/* VIEW: COMPARE */}
        {activeView === 'compare' && (
          <ComparisonMatrix />
        )}

      </div>

      <KnowledgeBaseDrawer />
    </main>
  );
}