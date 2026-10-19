'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';

export function ExportPDFButton() {
  const [mounted, setMounted] = useState(false);
  const { current } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Safely pull all current data
  const c = current || {};
  const p = c.property || {};
  const v = c.visaStatus || {};

  const land = p.landPrice || 0;
  const build = p.buildPrice || 0;
  const site = p.siteWorks || 0;
  const cashDeposit = c.cashDeposit || 0;

  // 2. Perform the target calculations
  const soilBuffer = getSoilBuffer(p.soilClassificationRisk);
  const totalBuildCost = build + site + (p.nathers7StarUpgrade || 0) + soilBuffer;
  const totalPropertyPrice = land + totalBuildCost;

  const stampDuty = calculateSaStampDuty(land);
  const surchargeRate = calculateEffectiveSurchargeRate(v);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge;
  const targetLoanAmount = Math.max(0, totalFundsRequired - cashDeposit);

  // Calculate a baseline 6% 30-year repayment for the report
  const monthlyRate = (6.0 / 100) / 12;
  let baselineRepayment = 0;
  if (targetLoanAmount > 0) {
    baselineRepayment = (targetLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -360));
  }

  // 3. The completely custom PDF Document Layout
  const dossierContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[99999] p-8 font-sans text-slate-900">
      {/* 
        This magical CSS block hides the main website during printing 
        and forces the browser to print the background colors of the cards! 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          main { display: none !important; }
          body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 10mm; size: A4 portrait; }
        }
      `}} />

      {/* Header */}
      <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Broke Builder</h1>
          <h2 className="text-xl text-slate-500 font-semibold mt-1">Executive Property Strategy Dossier</h2>
        </div>
        <div className="text-right text-sm text-slate-500 font-medium">
          <p>Generated: {new Date().toLocaleDateString('en-AU')}</p>
          <p>Confidential Beta Report</p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Applicant Card */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Applicant Profile</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-600">Primary Visa:</span> <span className="font-bold">{v.applicant1?.visa || 'N/A'}</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-600">Joint Purchase:</span> <span className="font-bold">{v.isJointPurchase ? 'Yes' : 'No'}</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-600">Combined Income:</span> <span className="font-bold">${((c.applicant1Income || 0) + (c.applicant2Income || 0)).toLocaleString()}</span></div>
              <div className="flex justify-between pt-1"><span className="text-slate-600">Available Cash Deposit:</span> <span className="font-bold text-emerald-700">${cashDeposit.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Property Card */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Property & Contract</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-600">Land Purchase Price:</span> <span className="font-bold">${land.toLocaleString()}</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-600">Base Build Contract:</span> <span className="font-bold">${build.toLocaleString()}</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-600">Site Works & Soil Risk:</span> <span className="font-bold">${(site + soilBuffer).toLocaleString()}</span></div>
              <div className="flex justify-between pt-1"><span className="text-slate-900 font-bold">Total Property Value:</span> <span className="font-black text-lg">${totalPropertyPrice.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: The Big Numbers */}
        <div>
          <div className="border-2 border-slate-900 rounded-xl p-6 bg-white h-full flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-6">Capital Acquisition Target</h3>
            <div className="space-y-5 flex-grow">
              <div>
                <p className="text-slate-500 mb-1 text-xs font-bold uppercase tracking-widest">State Stamp Duty (Est)</p>
                <p className="text-3xl font-bold text-slate-800">${stampDuty.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1 text-xs font-bold uppercase tracking-widest">Foreign Surcharge (Est)</p>
                <p className="text-3xl font-bold text-slate-800">${foreignSurcharge.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-emerald-50 -mx-6 -mb-6 p-6 border-t border-emerald-100 mt-6">
              <p className="text-emerald-800 font-bold mb-1 uppercase tracking-widest text-xs">Required Loan Amount</p>
              <p className="text-4xl font-black text-emerald-600">${targetLoanAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Risks Footer Grid */}
      <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-slate-50">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Risk & Holding Projections</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Pre-Build Delay</p>
            <p className="font-bold text-lg text-slate-800">{c.preBuildDelayMonths ?? 0} Months</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Builder Escalation</p>
            <p className="font-bold text-lg text-slate-800">{c.builderEscalationPct ?? 6.0}% /yr</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Contingency Buffer</p>
            <p className="font-bold text-lg text-slate-800">{c.contingencyPct ?? 10}%</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Est. Repayment (6%)</p>
            <p className="font-bold text-lg text-emerald-600">${Math.round(baselineRepayment).toLocaleString()} /mo</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-6 uppercase tracking-wider">
        <p className="font-bold text-slate-500 mb-1">Important Disclaimer</p>
        <p>This dossier is a strategic estimation generated by Broke Builder and does not constitute formal financial, tax, or legal advice.</p>
        <p>Verify all duties, surcharges, loan terms, and visa eligibility with a licensed broker and conveyancer prior to signing contracts.</p>
      </div>

    </div>
  );

  return (
    <>
      <button
        onClick={() => window.print()}
        className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 print:hidden"
      >
        <FileText className="w-4 h-4" />
        <span className="font-semibold text-sm">Download Dossier</span>
      </button>
      
      {/* This renders the hidden dossier safely outside the main website structure */}
      {mounted && createPortal(dossierContent, document.body)}
    </>
  );
}