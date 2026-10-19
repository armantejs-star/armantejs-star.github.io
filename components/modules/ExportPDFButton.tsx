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

  // --- DATA EXTRACTION ---
  const c = current || {};
  const p = c.property || {};
  const v = c.visaStatus || {};

  const land = p.landPrice || 0;
  const build = p.buildPrice || 0;
  const site = p.siteWorks || 0;
  const nathers = p.nathers7StarUpgrade || 0;
  const cashDeposit = c.cashDeposit || 0;
  const combinedIncome = (c.applicant1Income || 0) + (c.applicant2Income || 0);

  // --- CORE CALCULATIONS ---
  const soilBuffer = getSoilBuffer(p.soilClassificationRisk);
  const totalBuildCost = build + site + nathers + soilBuffer;
  const totalPropertyPrice = land + totalBuildCost;

  const stampDuty = calculateSaStampDuty(land);
  const surchargeRate = calculateEffectiveSurchargeRate(v);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  const totalSetupCosts = (c.conveyancingFees || 0) + (c.postBuildSetup || 0);
  const totalFundsRequired = totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const targetLoanAmount = Math.max(0, totalFundsRequired - cashDeposit);

  const monthlyRate = (6.0 / 100) / 12;
  const baselineRepayment = targetLoanAmount > 0 
    ? (targetLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -360)) 
    : 0;
  const lvr = totalPropertyPrice > 0 ? (targetLoanAmount / totalPropertyPrice) * 100 : 0;

  // --- DYNAMIC INFERENCES & ADVICE ENGINE ---
  const advice: string[] = [];

  if (lvr > 80) {
    advice.push(`LMI Warning: Your estimated Loan-to-Value Ratio (LVR) is ${lvr.toFixed(1)}%. Because it is over 80%, you will likely need to pay Lenders Mortgage Insurance (LMI). Consider increasing your cash deposit by $${Math.max(0, (totalPropertyPrice * 0.2) - cashDeposit).toLocaleString()} to avoid this.`);
  } else if (lvr > 0) {
    advice.push(`Healthy LVR: Your LVR is ${lvr.toFixed(1)}%, meaning you comfortably avoid Lenders Mortgage Insurance (LMI).`);
  }

  if (foreignSurcharge > 0) {
    advice.push(`Surcharge Exposure: Your current visa status triggers a ${(surchargeRate * 100).toFixed(1)}% foreign buyer surcharge ($${foreignSurcharge.toLocaleString()}). If PR is imminent, delaying the land contract could save you this entire amount.`);
  }

  if ((c.preBuildDelayMonths || 0) > 6) {
    const rentLoss = (c.currentMonthlyRent || 0) * (c.preBuildDelayMonths || 0);
    advice.push(`High Holding Costs: A ${c.preBuildDelayMonths}-month pre-build delay will cost you approximately $${rentLoss.toLocaleString()} in dead rent. Ensure the builder has fixed the base price, or apply your ${c.builderEscalationPct}% escalation rate strictly.`);
  }

  if ((c.contingencyPct || 0) < 10) {
    advice.push(`Contingency Risk: Your contingency buffer is only ${c.contingencyPct}%. For new builds with unknown rock/soil risks, a standard 10-15% buffer is highly recommended.`);
  }

  if ((c.etfReturnPct || 0) > (c.propertyGrowthPct || 0)) {
    advice.push(`Opportunity Cost: You projected ETF returns (${c.etfReturnPct}%) to be higher than Property Growth (${c.propertyGrowthPct}%). If land titling is severely delayed, your cash deposit may work harder in liquid markets temporarily.`);
  }

  // --- PDF LAYOUT ---
  const dossierContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-50 p-8 font-sans text-slate-900 leading-snug">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          main { display: none !important; }
          body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 10mm; size: A4 portrait; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
        }
      `}} />

      <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-end avoid-break">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Broke Builder</h1>
          <h2 className="text-xl text-slate-500 font-semibold mt-1">Comprehensive Strategy & Data Dossier</h2>
        </div>
        <div className="text-right text-sm text-slate-500 font-medium">
          <p>Generated: {new Date().toLocaleDateString('en-AU')}</p>
        </div>
      </div>

      <div className="mb-8 avoid-break border border-slate-200 p-5 rounded-xl bg-slate-50">
        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-800 mb-4">Total Capital Allocation Visualizer</h3>
        
        {/* THE FIX: Removed the escaped slashes in the width percentages */}
        <div className="w-full h-8 flex rounded overflow-hidden shadow-inner mb-3">
          <div style={{ width: `${(land / totalFundsRequired) * 100}%` }} className="bg-sky-600 border-r border-white/20" title="Land"></div>
          <div style={{ width: `${(totalBuildCost / totalFundsRequired) * 100}%` }} className="bg-emerald-500 border-r border-white/20" title="Build"></div>
          <div style={{ width: `${(stampDuty / totalFundsRequired) * 100}%` }} className="bg-amber-500 border-r border-white/20" title="Stamp Duty"></div>
          <div style={{ width: `${(foreignSurcharge / totalFundsRequired) * 100}%` }} className="bg-red-500 border-r border-white/20" title="Surcharge"></div>
          <div style={{ width: `${(totalSetupCosts / totalFundsRequired) * 100}%` }} className="bg-slate-500" title="Fees"></div>
        </div>
        
        <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-sky-600 rounded-sm"></div> Land ({((land/totalFundsRequired)*100).toFixed(1)}%)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Build ({((totalBuildCost/totalFundsRequired)*100).toFixed(1)}%)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> Duty ({((stampDuty/totalFundsRequired)*100).toFixed(1)}%)</div>
          {foreignSurcharge > 0 && <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Surcharge</div>}
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-500 rounded-sm"></div> Setup & Fees</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 avoid-break">
        <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Property Value</p>
          <p className="text-2xl font-black text-slate-900">${totalPropertyPrice.toLocaleString()}</p>
        </div>
        <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Cash Required</p>
          <p className="text-2xl font-black text-slate-900">${totalFundsRequired.toLocaleString()}</p>
        </div>
        <div className="border border-emerald-200 p-4 rounded-xl text-center bg-emerald-50">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Target Loan (Est)</p>
          <p className="text-2xl font-black text-emerald-600">${targetLoanAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-8 avoid-break border-l-4 border-emerald-500 bg-slate-50 p-5 rounded-r-xl">
        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-800 mb-3">AI Strategic Inferences & Advice</h3>
        <ul className="space-y-3">
          {advice.length > 0 ? advice.map((tip, i) => (
            <li key={i} className="text-sm text-slate-700 leading-relaxed flex items-start">
              <span className="mr-2 text-emerald-500 font-bold">→</span> {tip}
            </li>
          )) : (
            <li className="text-sm text-slate-700">All metrics look balanced. No critical risk flags detected in the current capital configuration.</li>
          )}
        </ul>
      </div>

      <h3 className="text-sm uppercase tracking-widest font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Complete Data Parameter Dump</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 avoid-break">
        
        <div>
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Profile & Income</h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Visa Status</td><td className="py-1 font-bold text-right">{v.applicant1?.visa || 'N/A'}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Joint Purchase</td><td className="py-1 font-bold text-right">{v.isJointPurchase ? 'Yes' : 'No'}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">First Home Buyer</td><td className="py-1 font-bold text-right">{v.applicant1?.isFirstHomeBuyer ? 'Yes' : 'No'}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Combined Income</td><td className="py-1 font-bold text-right">${combinedIncome.toLocaleString()}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Monthly Debts</td><td className="py-1 font-bold text-right">${c.monthlyDebts?.toLocaleString() || 0}</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Cash Deposit Available</td><td className="py-1 font-bold text-right text-emerald-600">${cashDeposit.toLocaleString()}</td></tr>
            </tbody>
          </table>

          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2 mt-5">Construction & Buffer</h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Pre-Build Delay</td><td className="py-1 font-bold text-right">{c.preBuildDelayMonths || 0} Months</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Builder Escalation</td><td className="py-1 font-bold text-right">{c.builderEscalationPct || 0}% /yr</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Contingency Buffer</td><td className="py-1 font-bold text-right">{c.contingencyPct || 0}%</td></tr>
              <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Post-Build Setup</td><td className="py-1 font-bold text