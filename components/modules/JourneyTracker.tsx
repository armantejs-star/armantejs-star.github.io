'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Circle } from 'lucide-react';

export function JourneyTracker() {
  const { current } = useAppStore();
  const { 
    activeView, property, establishedProperty, applicant1Income, cashDeposit 
  } = current;

  // 1. DETERMINE WHICH JOURNEY WE ARE ON
  const isBuild = activeView === 'build';
  const isCompare = activeView === 'compare';

  // 2. DEFINE THE MILESTONES & COMPLETION LOGIC
  let steps = [];
  let currentStep = 0;

  if (isBuild || isCompare) {
    // BUILD JOURNEY LOGIC
    const hasLand = (property?.landPrice || 0) > 0;
    const hasBuild = (property?.buildPrice || 0) > 0;
    const hasFinance = (applicant1Income || 0) > 0 || (cashDeposit || 0) > 0;
    const hasSiteWorks = (property?.siteWorks || 0) > 0;
    
    if (hasLand) currentStep = 1;
    if (hasLand && hasBuild) currentStep = 2;
    if (hasLand && hasBuild && hasFinance) currentStep = 3;
    if (hasLand && hasBuild && hasFinance && hasSiteWorks) currentStep = 4;
    
    steps = [
      { label: "Site Prep", completed: currentStep >= 1 },
      { label: "Slab Poured", completed: currentStep >= 2 },
      { label: "Frame Stage", completed: currentStep >= 3 },
      { label: "Lock-Up", completed: currentStep >= 4 },
      { label: "Handover", completed: currentStep >= 4 } // Completes alongside Lock-Up to show full readiness
    ];
  } else {
    // ESTABLISHED JOURNEY LOGIC
    const hasTarget = (establishedProperty?.purchasePrice || 0) > 0;
    const hasFinance = (applicant1Income || 0) > 0 || (cashDeposit || 0) > 0;
    const hasBuffer = (establishedProperty?.renovationBuffer || 0) > 0 || (establishedProperty?.strataYearly || 0) > 0;

    if (hasTarget) currentStep = 1;
    if (hasTarget && hasBuffer) currentStep = 2;
    if (hasTarget && hasBuffer && hasFinance) currentStep = 3;
    if (hasTarget && hasBuffer && hasFinance) currentStep = 4; 

    steps = [
      { label: "Target Sourced", completed: currentStep >= 1 },
      { label: "Inspections", completed: currentStep >= 2 },
      { label: "Unconditional", completed: currentStep >= 3 },
      { label: "Settlement", completed: currentStep >= 4 }
    ];
  }

  // Calculate percentage for the connecting green line
  const progressPercentage = steps.length > 1 
    ? (steps.filter(s => s.completed).length - 1) / (steps.length - 1) * 100 
    : 0;

  return (
    <div className="w-full bg-white px-4 md:px-8 py-5 border-b border-slate-200 print:hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isBuild ? "Construction Pipeline" : isCompare ? "Strategy Pipeline" : "Acquisition Pipeline"}
          </h3>
          <span className="text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
            {steps.filter(s => s.completed).length} / {steps.length} Stages Mapped
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
          
          {/* Active Emerald Fill Line */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${Math.max(0, progressPercentage)}%` }}
          />

          {/* Milestone Nodes */}
          <div className="relative flex justify-between z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700 bg-white
                  ${step.completed 
                    ? 'shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' 
                    : 'shadow-[0_0_0_4px_white]'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 fill-white" />
                  )}
                </div>
                {/* Labels */}
                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider absolute top-10 whitespace-nowrap transition-colors duration-500
                  ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Spacer for absolute positioned labels below the line */}
        <div className="h-6" />
      </div>
    </div>
  );
}