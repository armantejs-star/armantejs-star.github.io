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
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const c = current || {};
  const p = c.property || {};
  const v = c.visaStatus || {};

  const land = p.landPrice || 0;
  const build = p.buildPrice || 0;
  const site = p.siteWorks || 0;
  const nathers = p.nathers7StarUpgrade || 0;
  const cashDeposit = c.cashDeposit || 0;
  const combinedIncome = 
    (c.applicant1Income || 0) + (c.applicant2Income || 0);

  const soilBuffer = getSoilBuffer(p.soilClassificationRisk);
  const totalBuildCost = build + site + nathers + soilBuffer;
  const totalPropertyPrice = land + totalBuildCost;

  const stampDuty = calculateSaStampDuty(land);
  const surchargeRate = calculateEffectiveSurchargeRate(v);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  const totalSetupCosts = 
    (c.conveyancingFees || 0) + (c.postBuildSetup || 0);
  const totalFundsRequired = 
    totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  const targetLoanAmount = Math.max(0, totalFundsRequired - cashDeposit);

  const monthlyRate = (6.0 / 100) / 12;
  const baselineRepayment = targetLoanAmount > 0 
    ? (targetLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -360)) 
    : 0;
  const lvr = totalPropertyPrice > 0 
    ? (targetLoanAmount / totalPropertyPrice) * 100 
    : 0;

  const advice: string[] = [];

  if (lvr > 80) {
    advice.push(
      `LMI Warning: Your estimated LVR is ${lvr.toFixed(1)}%. ` +
      `Because it is over 80%, you will likely need to pay LMI. ` +
      `Consider increasing your deposit to avoid this.`
    );
  } else if (lvr > 0) {
    advice.push(
      `Healthy LVR: Your LVR is ${lvr.toFixed(1)}%, meaning ` +
      `you comfortably avoid Lenders Mortgage Insurance (LMI).`
    );
  }

  if (foreignSurcharge > 0) {
    advice.push(
      `Surcharge Exposure: Your visa status triggers a ` +
      `${(surchargeRate * 100).toFixed(1)}% foreign buyer surcharge ` +
      `($${foreignSurcharge.toLocaleString()}).`
    );
  }

  if ((c.preBuildDelayMonths || 0) > 6) {
    const rentLoss = (c.currentMonthlyRent || 0) * (c.preBuildDelayMonths || 0);
    advice.push(
      `High Holding Costs: A ${c.preBuildDelayMonths}-month delay ` +
      `costs approx $${rentLoss.toLocaleString()} in dead rent.`
    );
  }

  const dossierContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-50 p-8 font-sans text-slate-900 leading-snug">
      <style 
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              main { display: none !important; }
              body { background-color: white !important; }
              @page { margin: 10mm; size: A4 portrait; }
              .avoid-break { page-break-inside: avoid; }
            }
          `
        }} 
      />

      <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-end avoid-break">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
            Broke Builder
          </h1>
          <h2 className="text-xl text-slate-500 font-semibold mt-1">
            Strategy & Data Dossier
          </h2>
        </div>
      </div>

      <div className="mb-8 avoid-break border border-slate-200 p-5 rounded-xl bg-slate-50">
        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-800 mb-4">
          Total Capital Allocation
        </h3>
        
        <div className="w-full h-8 flex rounded overflow-hidden shadow-inner mb-3">
          <div 
            style={{ width: `${(land / totalFundsRequired) * 100}%` }} 
            className="bg-sky-600 border-r border-white/20" 
          />
          <div 
            style={{ width: `${(totalBuildCost / totalFundsRequired) * 100}%` }} 
            className="bg-emerald-500 border-r border-white/20" 
          />
          <div 
            style={{ width: `${(stampDuty / totalFundsRequired) * 100}%` }} 
            className="bg-amber-500 border-r border-white/20" 
          />
          <div 
            style={{ width: `${(foreignSurcharge / totalFundsRequired) * 100}%` }} 
            className="bg-red-500 border-r border-white/20" 
          />
          <div 
            style={{ width: `${(totalSetupCosts / totalFundsRequired) * 100}%` }} 
            className="bg-slate-500" 
          />
        </div>
        
        <div className="flex justify-between text-xs font-bold text-slate-600 uppercase">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-sky-600 rounded-sm" /> 
            Land
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> 
            Build
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-sm" /> 
            Duty
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-500 rounded-sm" /> 
            Fees
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 avoid-break">
        <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Property Value
          </p>
          <p className="text-2xl font-black text-slate-900">
            ${totalPropertyPrice.toLocaleString()}
          </p>
        </div>
        <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Cash Required
          </p>
          <p className="text-2xl font-black text-slate-900">
            ${totalFundsRequired.toLocaleString()}
          </p>
        </div>
        <div className="border border-emerald-200 p-4 rounded-xl text-center bg-emerald-50">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
            Target Loan
          </p>
          <p className="text-2xl font-black text-emerald-600">
            ${targetLoanAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-8 avoid-break border-l-4 border-emerald-500 bg-slate-50 p-5 rounded-r-xl">
        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-800 mb-3">
          AI Strategic Advice
        </h3>
        <ul className="space-y-3">
          {advice.map((tip, i) => (
            <li key={i} className="text-sm text-slate-700 flex items-start">
              <span className="mr-2 text-emerald-500 font-bold">→</span> 
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <h3 className="text-sm uppercase tracking-widest font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
        Complete Data Dump
      </h3>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 avoid-break">
        <div>
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
            Profile & Math
          </h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Visa Status</td>
                <td className="py-1 font-bold text-right">
                  {v.applicant1?.visa || 'N/A'}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Combined Income</td>
                <td className="py-1 font-bold text-right">
                  ${combinedIncome.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Cash Deposit</td>
                <td className="py-1 font-bold text-right text-emerald-600">
                  ${cashDeposit.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Est. Repayment (6%)</td>
                <td className="py-1 font-bold text-right">
                  ${Math.round(baselineRepayment).toLocaleString()} /mo
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
            Build Breakdown
          </h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Land Price</td>
                <td className="py-1 font-bold text-right">
                  ${land.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Base Build</td>
                <td className="py-1 font-bold text-right">
                  ${build.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Site Works</td>
                <td className="py-1 font-bold text-right">
                  ${site.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => window.print()}
        className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800 print:hidden"
      >
        <FileText className="w-4 h-4" />
        <span className="font-semibold text-sm">Download Dossier</span>
      </button>
      {mounted && createPortal(dossierContent, document.body)}
    </>
  );
}