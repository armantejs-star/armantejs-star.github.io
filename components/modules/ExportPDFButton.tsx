'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, FileCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getSoilBuffer } from '@/constants/soil';
import { calculateSaStampDuty } from '@/lib/math/stampDuty';
import { calculateEffectiveSurchargeRate } from '@/lib/math/mixedVisa';

export function ExportPDFButton() {
  const [mounted, setMounted] = useState(false);
  const [printMode, setPrintMode] = useState<'dossier' | 'terms' | null>(null);
  const { current } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = (mode: 'dossier' | 'terms') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const c = current || {};
  const p = c.property || {};
  const v = c.visaStatus || {};

  const clientName = (c as unknown as { clientName?: string }).clientName?.trim() || 'Valued Client';
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

  const isSaFhbEligible = (c as unknown as { isSaFhbEligible?: boolean }).isSaFhbEligible || false;
  const stampDuty = calculateSaStampDuty(land, isSaFhbEligible);
  const fhbGrant = isSaFhbEligible ? 15000 : 0;
  
  const surchargeRate = calculateEffectiveSurchargeRate(v);
  const foreignSurcharge = totalPropertyPrice * surchargeRate;

  const totalSetupCosts = 
    (c.conveyancingFees || 0) + (c.postBuildSetup || 0) + ((c as unknown as { turnkeyAllowance?: number }).turnkeyAllowance || 0);
  const totalFundsRequired = 
    totalPropertyPrice + stampDuty + foreignSurcharge + totalSetupCosts;
  
  const targetLoanAmount = Math.max(0, totalFundsRequired - cashDeposit - fhbGrant);

  // --- NEW LOAN MATH ---
  const monthlyRate = (6.0 / 100) / 12;
  const loanTermYears = (c as unknown as { loanTermYears?: number }).loanTermYears || 30;
  const loanTermMonths = loanTermYears * 12;
  const repaymentType = (c as unknown as { repaymentType?: string }).repaymentType || 'PI';

  let baselineRepayment = 0;
  if (targetLoanAmount > 0) {
    if (repaymentType === 'IO') {
      baselineRepayment = targetLoanAmount * monthlyRate;
    } else {
      baselineRepayment = (targetLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTermMonths));
    }
  }
  // ---------------------

  const lvr = totalPropertyPrice > 0 
    ? (targetLoanAmount / totalPropertyPrice) * 100 
    : 0;

  const advice: string[] = [];

  if (isSaFhbEligible) {
    advice.push(
      `First Home Advantage: By building new in SA, you are saving on Stamp Duty and utilizing the $15,000 grant, drastically improving your cash position.`
    );
  }

  if (lvr > 80) {
    advice.push(
      `LMI Warning: Your estimated LVR is ${lvr.toFixed(1)}%. Because it is over 80%, you will likely need to pay LMI. Consider increasing your deposit.`
    );
  } else if (lvr > 0) {
    advice.push(
      `Healthy LVR: Your LVR is ${lvr.toFixed(1)}%, meaning you comfortably avoid Lenders Mortgage Insurance (LMI).`
    );
  }

  if (foreignSurcharge > 0) {
    advice.push(
      `Surcharge Exposure: Your visa status triggers a ${(surchargeRate * 100).toFixed(1)}% foreign buyer surcharge ($${foreignSurcharge.toLocaleString()}).`
    );
  }

  const dossierOnlyContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-50 p-8 font-sans text-slate-900 leading-snug">
      <style 
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              main { display: none !important; }
              body { background-color: white !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              @page { margin: 10mm; size: A4 portrait; }
              .avoid-break { page-break-inside: avoid; }
            }
          `
        }} 
      />

      <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-end avoid-break">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Property Strategy Dossier
          </h1>
          <p className="text-sm font-bold text-emerald-700 mt-1">
            Prepared for: {clientName}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 font-medium">
          <p>Date: {new Date().toLocaleDateString('en-AU')}</p>
          <p>Consultation Document</p>
        </div>
      </div>

      <div className="mb-6 avoid-break border border-slate-200 p-5 rounded-xl bg-slate-50">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-800 mb-3">
          Total Capital Allocation Visualizer
        </h3>
        
        <div className="w-full h-8 flex rounded overflow-hidden shadow-inner mb-3 bg-slate-200">
          <div 
            style={{ width: `${(land / (totalFundsRequired || 1)) * 100}%` }} 
            className="bg-sky-600 border-r border-white/20 h-full" 
          />
          <div 
            style={{ width: `${(totalBuildCost / (totalFundsRequired || 1)) * 100}%` }} 
            className="bg-emerald-500 border-r border-white/20 h-full" 
          />
          <div 
            style={{ width: `${(stampDuty / (totalFundsRequired || 1)) * 100}%` }} 
            className="bg-amber-500 border-r border-white/20 h-full" 
          />
          <div 
            style={{ width: `${(foreignSurcharge / (totalFundsRequired || 1)) * 100}%` }} 
            className="bg-red-500 border-r border-white/20 h-full" 
          />
          <div 
            style={{ width: `${(totalSetupCosts / (totalFundsRequired || 1)) * 100}%` }} 
            className="bg-slate-500 h-full" 
          />
        </div>
        
        <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-sky-600 rounded-sm" /> Land
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Build
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Duty
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-slate-500 rounded-sm" /> Fees
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 avoid-break">
        <div className="border border-slate-200 p-3 rounded-xl text-center bg-white">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Property Value
          </p>
          <p className="text-xl font-black text-slate-900">
            ${totalPropertyPrice.toLocaleString()}
          </p>
        </div>
        <div className="border border-slate-200 p-3 rounded-xl text-center bg-white">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Cash Required
          </p>
          <p className="text-xl font-black text-slate-900">
            ${totalFundsRequired.toLocaleString()}
          </p>
        </div>
        <div className="border border-emerald-200 p-3 rounded-xl text-center bg-emerald-50">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">
            Target Loan
          </p>
          <p className="text-xl font-black text-emerald-600">
            ${targetLoanAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-6 avoid-break border-l-4 border-emerald-500 bg-slate-50 p-4 rounded-r-xl">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-800 mb-2">
          Strategic Inferences & Notes
        </h3>
        <ul className="space-y-2">
          {advice.map((tip, i) => (
            <li key={i} className="text-xs text-slate-700 flex items-start">
              <span className="mr-2 text-emerald-500 font-bold">→</span> 
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <h3 className="text-xs uppercase tracking-widest font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">
        Parameters Breakdown
      </h3>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 avoid-break text-xs">
        <div className="bg-white p-3 rounded border border-slate-200">
          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">
            Profile & Math
          </h4>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Visa Status</td>
                <td className="py-1 font-bold text-right">{v.applicant1?.visa || 'N/A'}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Combined Income</td>
                <td className="py-1 font-bold text-right">${combinedIncome.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Cash Deposit</td>
                <td className="py-1 font-bold text-right text-emerald-600">${cashDeposit.toLocaleString()}</td>
              </tr>
              {fhbGrant > 0 && (
                <tr className="border-b border-slate-100">
                  <td className="py-1 text-slate-600">SA FHB Grant</td>
                  <td className="py-1 font-bold text-right text-emerald-600">${fhbGrant.toLocaleString()}</td>
                </tr>
              )}
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">
                  Est. Repayment ({loanTermYears}yr {repaymentType === 'IO' ? 'IO' : 'P&I'} @ 6%)
                </td>
                <td className="py-1 font-bold text-right">${Math.round(baselineRepayment).toLocaleString()} /mo</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200">
          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">
            Build Breakdown
          </h4>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Land Price</td>
                <td className="py-1 font-bold text-right">${land.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Base Build</td>
                <td className="py-1 font-bold text-right">${build.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Site Works</td>
                <td className="py-1 font-bold text-right">${site.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1 text-slate-600">Soil/Risk Buffer</td>
                <td className="py-1 font-bold text-right">${soilBuffer.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const termsOnlyContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-50 p-8 font-sans text-slate-900 leading-snug">
      <style 
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              main { display: none !important; }
              body { background-color: white !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              @page { margin: 10mm; size: A4 portrait; }
              .avoid-break { page-break-inside: avoid; }
            }
          `
        }} 
      />

      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900 uppercase">
            Terms & Conditions of Consultation Services
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Prepared for: <span className="font-bold text-slate-900">{clientName}</span>
          </p>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Date: {new Date().toLocaleDateString('en-AU')}
        </p>
      </div>

      <div className="space-y-3 text-[10px] text-slate-700 leading-normal">
        <div>
          <h4 className="font-bold text-slate-900">1. INTRODUCTION AND ACCEPTANCE OF TERMS</h4>
          <p>These Terms govern property strategy and consultation services provided by Mantej Singh (&quot;Consultant&quot;). By engaging our Services, paying consultation fees, or receiving documentation, you (&quot;Client&quot;) agree to these Terms in full.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">2. STRICTLY NO FINANCIAL, LEGAL, OR TAX ADVICE</h4>
          <p>Services are strictly for educational and general strategic purposes. The Consultant is not a licensed financial advisor, mortgage broker, conveyancer, accountant, or legal practitioner. Figures provided do not constitute personal financial advice.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">3. NATURE OF SERVICES AND LIMITATIONS OF ESTIMATIONS</h4>
          <p>Services utilize analytical models based on generalized assumptions of the South Australian property market. All figures (including build costs, site works, and soil buffers) are estimations only and do not constitute fixed quotes or binding contracts.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">4. TIME-SENSITIVITY OF DOSSIERS AND MARKET VOLATILITY</h4>
          <p>Estimations represent a snapshot in time based on market conditions on the date of generation. Cost, interest rate, and legislation metrics are subject to change without notice.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">5. CLIENT OBLIGATIONS AND ACCURACY OF DATA</h4>
          <p>Estimations rely on the accuracy of Client-provided information. The Consultant does not independently audit Client data. Clients agree to seek verification from licensed brokers, conveyancers, and accountants before executing contracts.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">6. SCOPE OF ENGAGEMENT & FEES</h4>
          <p>Payment entitles the Client strictly to the agreed consultation session and one (1) Strategy Dossier. Subsequent requests for updates or re-evaluations constitute a new engagement. Fees are non-refundable once modeling is delivered.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">7. CONFIDENTIALITY AND LIMITATION OF LIABILITY</h4>
          <p>Client data is kept strictly confidential. To the maximum extent permitted by Australian law, the Consultant shall not be liable for direct or indirect losses, loan rejections, or increased construction costs arising from reliance on the consultation.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">8. INDEPENDENT OPERATION & CONFLICT OF INTEREST DISCLOSURE</h4>
          <p>The Consultant provides these services as an independent contractor. This consultation, the software utilized, and the resulting Strategy Dossier are strictly independent and are not affiliated with, endorsed by, or representative of the Consultant&apos;s employer, Weeks Homes, or any other specific building entity.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">9. GOVERNMENT GRANTS, VISAS, AND TAXATION POLICIES</h4>
          <p>The Strategy Dossier models potential eligibility for government incentives, including the South Australian First Home Owner Grant, Stamp Duty exemptions, and RevenueSA Foreign Buyer Surcharge refunds. The Consultant is not a registered migration agent or government representative. Eligibility for grants, tax exemptions, and visa-related refunds is strictly determined by RevenueSA and the Department of Home Affairs. Clients must independently verify their eligibility as legislation is subject to change.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">10. DATA PRIVACY AND SOFTWARE PROCESSING</h4>
          <p>Client data entered during the consultation is processed locally within the web browser to generate the Strategy Dossier. The Consultant&apos;s software does not transmit, harvest, or store sensitive financial or Personally Identifiable Information (PII) on external database servers. The Client is solely responsible for the safe keeping of their printed or downloaded Dossier.</p>
        </div>
      </div>
<div>
          <h4 className="font-bold text-slate-900">11. GEOTECHNICAL AND SITE ENGINEERING LIMITATIONS</h4>
          <p>The &quot;Adelaide Soil Reactivity Risk&quot; buffer utilized in the Strategy Dossier is an estimation based on regional averages. It does not replace a formal geotechnical soil test, contour survey, or structural engineering report. Actual site works and footing costs can strictly only be finalized by a licensed builder following official engineering investigations.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">12. DEVELOPER ENCUMBRANCES AND COUNCIL REGULATIONS</h4>
          <p>Estimations provided do not account for hidden developer encumbrances, specific local council regulations (including mandatory retaining walls or stormwater detention systems), or National Construction Code (NCC) 2022 energy efficiency orientation mandates. These site-specific requirements frequently incur additional post-contract variations.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">13. BANK VALUATION SHORTFALL ACKNOWLEDGMENT</h4>
          <p>The &quot;Target Loan&quot; and &quot;Estimated LVR&quot; metrics are calculated based on the total estimated capital cost of the project. The Consultant does not guarantee that a lending institution will value the completed property at this total cost. The Client acknowledges the inherent risk of bank valuation shortfalls and the potential requirement for additional cash funds prior to unconditional finance approval.</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">14. EXCLUSION OF THIRD-PARTY RELIANCE</h4>
          <p>This Strategy Dossier is prepared exclusively for the personal use of the named Client. It may not be relied upon by third parties, including but not limited to builders, mortgage brokers, conveyancers, or financial institutions, for the purpose of extending credit, providing final legal advice, or executing binding building contracts.</p>
        </div>
      <div className="mt-8 border-2 border-slate-900 p-4 rounded-xl bg-slate-50 avoid-break">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
          Client Acknowledgment & Declaration
        </h4>
        <p className="text-[10px] text-slate-600 mb-4">
          By signing below or replying via email accepting this agreement, I, <strong className="text-slate-900">{clientName}</strong>, confirm that I have read, understood, and agreed to the Terms and Conditions above. I acknowledge that Mantej Singh is providing general property estimations and is not a licensed financial advisor.
        </p>

        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-300">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase">Client Signature</p>
            <div className="h-8 border-b border-slate-400 mt-1"></div>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase">Date</p>
            <div className="h-8 border-b border-slate-400 mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 print:hidden">
      <button
        onClick={() => handlePrint('dossier')}
        className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span className="font-semibold text-xs md:text-sm">Download Dossier</span>
      </button>

      <button
        onClick={() => handlePrint('terms')}
        className="flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-200 transition-colors"
      >
        <FileCheck className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold text-xs md:text-sm">Download T&amp;C</span>
      </button>

      {mounted && printMode === 'dossier' && createPortal(dossierOnlyContent, document.body)}
      {mounted && printMode === 'terms' && createPortal(termsOnlyContent, document.body)}
    </div>
  );
}