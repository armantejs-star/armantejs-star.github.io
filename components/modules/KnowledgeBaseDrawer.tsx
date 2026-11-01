'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, BookOpen, ShieldAlert, Landmark, Building2, Scale, Wallet } from 'lucide-react';

export function KnowledgeBaseDrawer() {
  const { isKnowledgeBaseOpen, setKnowledgeBaseOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState<'firb' | 'sa' | 'banking'>('firb');

  if (!isKnowledgeBaseOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setKnowledgeBaseOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Broke Builder Training</h2>
              <p className="text-xs text-slate-400 mt-1">Legal & Compliance Reference Guide</p>
            </div>
          </div>
          <button 
            onClick={() => setKnowledgeBaseOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-4 gap-2 bg-slate-800/50 border-b border-slate-800 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('firb')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'firb' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Scale className="w-4 h-4" /> Federal FIRB
          </button>
          <button
            onClick={() => setActiveTab('sa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'sa' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Landmark className="w-4 h-4" /> RevenueSA
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'banking' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Wallet className="w-4 h-4" /> Banking & LMI
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* FIRB TAB */}
          {activeTab === 'firb' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4" /> Established Property Ban
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Temporary residents (including 491 visa holders) are strictly forbidden from buying established properties for investment purposes. They may only purchase new builds or vacant land. 
                </p>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4" /> Spousal Exemption (Joint Tenants)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  If a temporary resident purchases property as a <strong>Joint Tenant</strong> with an Australian Citizen, Permanent Resident (189, 190, 801, 820), or NZ Citizen (444), they are completely exempt from the $15,600 FIRB application fee.
                </p>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4" /> The 4-Year Build Mandate
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  FIRB requires temporary residents purchasing vacant land to complete construction within 4 years of approval. If they fail to build, they may be forced to sell the land.
                </p>
              </div>
            </div>
          )}

          {/* REVENUESA TAB */}
          {activeTab === 'sa' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4" /> 7% Foreign Surcharge
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  South Australia applies a massive 7% surcharge on the property value for temporary residents. Like FIRB, this is waived if the buyer is purchasing jointly with a Citizen, PR, or NZ Special Category Visa holder.
                </p>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-3">
                  <Scale className="w-4 h-4" /> First Home Owner Grant (FHOG)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  While SA abolished price caps for the stamp duty waiver, the actual <strong>$15,000 cash grant</strong> is only awarded if at least one applicant is a Citizen or Permanent Resident. Couples consisting entirely of temporary residents receive neither the grant nor the stamp duty waiver.
                </p>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4" /> The 18-Month Rule
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  RevenueSA dictates that construction must be completed within 18 months of laying the foundation to retain the FHOG. This overrides the more lenient 4-year FIRB allowance.
                </p>
              </div>
            </div>
          )}

          {/* BANKING TAB */}
          {activeTab === 'banking' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4" /> The 80% LVR Hard Cap
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Australian Lenders Mortgage Insurance (LMI) providers generally refuse to insure temporary residents. Therefore, if no applicant is a Citizen or PR, the maximum Loan-to-Value Ratio (LVR) is strictly capped at 80%. A 20% deposit is mandatory.
                </p>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4" /> Acceptable Visas for LMI
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Subclasses 189, 190, 801, 820, and 444 are treated as permanent residents by most major Australian banks, allowing them to borrow up to 90-95% LVR and incur standard LMI charges.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}