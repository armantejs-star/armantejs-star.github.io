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
import { TutorialGuide } from '@/components/modules/TutorialGuide';
import { EstablishedPropertyModule } from '@/components/modules/EstablishedPropertyModule';
import { ComparisonMatrix } from '@/components/modules/ComparisonMatrix';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen, UserCircle, Building, Home as HomeIcon, Scale } from 'lucide-react';

export default function Home() {
  const { current, setAppState, setKnowledgeBaseOpen, toggleHelpDrawer } = useAppStore();
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
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32 print:bg-white print:p-0 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 print:space-y-4">
        
        {/* HEADER AREA */}
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 print:flex-row print:mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Broke Builder</h1>
            <p className="text-slate-600 mt-2 print:hidden">
              Comprehensive Property, Construction & Financial Strategy Engine
            </p>
          </div>

          <div className="flex gap-3 print:hidden">
            <button 
              onClick={() => setKnowledgeBaseOpen(true)}
              className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-300 transition-colors shadow-sm"
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">Knowledge Base</span>
            </button>
            
            <button 
              onClick={toggleHelpDrawer}
              className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-200 transition-colors shadow-sm"
            >
              <UserCircle className="w-5 h-5" />
              <span>Operating Manual</span>
            </button>
          </div>
          
          <div className="flex gap-3 print:hidden">
            <InstallButton />
            <ExportCSVButton />
            <ExportPDFButton />
          </div>
        </div>

        {/* --- GLOBAL PROFILE (Always Visible) --- */}
        <div className="print:block space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-200 pb-2">Global Client Profile</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncomeDepositModule />
            <SpousalVisaMatrix />
          </div>
        </div>

        {/* --- MASTER SCENARIO TAB BAR --- */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-2 print:hidden">
          <button
            onClick={() => setAppState({ activeView: 'build' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
              activeView === 'build' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Building className="w-5 h-5" />
            Build New
          </button>
          
          <button
            onClick={() => setAppState({ activeView: 'established' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
              activeView === 'established' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            Buy Established
          </button>

          <button
            onClick={() => setAppState({ activeView: 'compare' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
              activeView === 'compare' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-5 h-5" />
            Compare Options
          </button>
        </div>

        {/* --- SCENARIO CONTENT ROUTER --- */}
        
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
      <TutorialGuide />
    </main>
  );
}