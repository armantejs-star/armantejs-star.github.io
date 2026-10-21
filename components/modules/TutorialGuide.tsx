'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, User, Home, Earth, AlertTriangle, FileCheck } from 'lucide-react';

export function TutorialGuide() {
  const { isHelpDrawerOpen, toggleHelpDrawer } = useAppStore();

  if (!isHelpDrawerOpen) return null;

  const phases = [
    {
      title: "Phase 1: Client Onboarding & Financial Baselines",
      icon: <User className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      steps: [
        {
          name: "Step 1: Enter the Client's Full Name",
          how: "In the 'Income, Funds & Loan Setup' section, type the client's name.",
          why: "This automatically populates their name onto the final PDF Dossier and the legal Terms & Conditions. Blank names void the personal legal protection."
        },
        {
          name: "Step 2: Enter Incomes, Deposit, and Expenses",
          how: "Input Applicant 1 (and 2 if joint) gross incomes, total Available Cash Deposit, and Estimated Living Expenses.",
          why: "The system uses the deposit to calculate their Loan-to-Value Ratio (LVR). If the deposit is too small, it automatically generates a warning in the PDF that they must pay Lenders Mortgage Insurance (LMI)."
        },
        {
          name: "Step 3: Set the Proposed Loan Strategy",
          how: "At the bottom of the Income module, set the expected Loan Term and select P&I or IO.",
          why: "This ensures the final monthly repayment estimations on the PDF exactly match the type of loan their broker will apply for."
        }
      ]
    },
    {
      title: "Phase 2: Property & Build Numbers",
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200",
      steps: [
        {
          name: "Step 4: Apply SA FHB Exemptions",
          how: "In the 'Property & Build Contract' module, check the 'Eligible for SA First Home Buyer' box if applicable.",
          why: "SA abolished stamp duty for new builds for eligible FHBs and provides a $15,000 grant. Checking this drops stamp duty to $0 and subtracts $15k from their required loan."
        },
        {
          name: "Step 5: Enter the Standard Build Prices",
          how: "Input the Land Purchase Price and the Builder's Base Contract Price.",
          why: "These are the foundational numbers that the entire strategy is built upon."
        },
        {
          name: "Step 6: Add the 'Hidden' Estimator Buffers",
          how: "Fill in Site Works, 7-Star NatHERS Upgrade, and the Post-Handover Turnkey Buffer (e.g., $15,000).",
          why: "Display home prices never include driveways or blinds. Allocating a Turnkey Buffer ensures the client has cash reserved to make the house legally occupiable."
        },
        {
          name: "Step 7: Select the Adelaide Soil Reactivity Risk",
          how: "Choose the soil risk from the dropdown. If no soil test exists, always select 'Unknown'.",
          why: "Adelaide has highly reactive clay. Selecting 'Unknown' or 'High' safely forces a $25k to $35k cash buffer into their required loan to pay for deep footings."
        }
      ]
    },
    {
      title: "Phase 3: Visa Status & Taxation",
      icon: <Earth className="w-5 h-5 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-200",
      steps: [
        {
          name: "Step 8: Select Visa Status",
          how: "In the 'Visa & Ownership Matrix', select the applicants' visa types.",
          why: "RevenueSA enforces a 7% foreign buyer surcharge on temporary residents. The app automatically calculates this hidden tax based on these dropdowns."
        },
        {
          name: "Step 9: Check the PR Refund Timeline",
          how: "If they pay a surcharge, use the 'RevenueSA PR Refund Strategy' slider to map out their expected Permanent Residency wait time.",
          why: "If they get PR within 12 months of settlement, RevenueSA refunds the 7% surcharge. This shows exactly how much cash they can reclaim."
        }
      ]
    },
    {
      title: "Phase 4: Holding Costs & Stress Tests",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50 border-amber-200",
      steps: [
        {
          name: "Step 10: Factor in Delays and Escalations",
          how: "In 'Advanced Build & Holding Costs', enter the Pre-Build Delay and Builder Price Escalation (usually ~6%).",
          why: "This calculates exactly how much their contract price will inflate while waiting for land to title."
        },
        {
          name: "Step 11: Review the 'Double-Hit' Cashflow Graph",
          how: "Scroll down and hover over the 'Double-Hit' Cashflow graph with the client.",
          why: "It visually proves they must pay their current rent PLUS 90% of their construction loan interest simultaneously right before handover."
        }
      ]
    },
    {
      title: "Phase 5: Generating the Documents",
      icon: <FileCheck className="w-5 h-5 text-slate-600" />,
      color: "bg-slate-100 border-slate-300",
      steps: [
        {
          name: "Step 12: Generate the Terms & Conditions",
          how: "Click the 'Download T&C' button.",
          why: "This must be signed first. It legally protects the business by stating these numbers are estimates and clarifies independence from Weeks Homes."
        },
        {
          name: "Step 13: Generate the Strategy Dossier",
          how: "Click the 'Download Dossier' button.",
          why: "This generates the final premium PDF for the client to take directly to their mortgage broker."
        }
      ]
    }
  ];

  return (
    <>
      {/* Dark Overlay Background */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleHelpDrawer}
      />

      {/* Slide-out Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 flex flex-col">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Operating Manual</h2>
            <p className="text-sm font-medium text-emerald-600">Consultant Step-by-Step Guide</p>
          </div>
          <button 
            onClick={toggleHelpDrawer}
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8">
          {phases.map((phase, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${phase.color}`}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/5">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {phase.icon}
                </div>
                <h3 className="font-bold text-slate-900">{phase.title}</h3>
              </div>
              
              <div className="space-y-5">
                {phase.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-800">{step.name}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900">How:</span> {step.how}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white/60 p-2 rounded-md border border-white">
                      <span className="font-bold text-emerald-700">Why it matters:</span> {step.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}