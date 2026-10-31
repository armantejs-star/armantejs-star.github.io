'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
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

  const { 
    activeView, property, establishedProperty, visaStatus, cashDeposit, 
    isSaFhbEligible, conveyancingFees, postBuildSetup, turnkeyAllowance,
    loanTermYears, repaymentType 
  } = current;

  const clientName = current.clientName?.trim() || 'Valued Client';
  const isBuild = activeView === 'build';
  const isEst = activeView === 'established';
  const isCompare = activeView === 'compare';

  // --- MATH CALCS ---
  const surchargeRate = calculateEffectiveSurchargeRate(visaStatus);
  
  // Build Math
  const buildLand = property?.landPrice || 0;
  const buildContract = (property?.buildPrice || 0) + (property?.siteWorks || 0) + (property?.nathers7StarUpgrade || 0) + getSoilBuffer(property?.soilClassificationRisk || 'Unknown');
  const buildTotalProperty = buildLand + buildContract;
  const buildStampDuty = calculateSaStampDuty(buildLand, isSaFhbEligible);
  const buildFhbGrant = isSaFhbEligible ? 15000 : 0;
  const buildSurcharge = buildTotalProperty * surchargeRate;
  const buildSetup = (conveyancingFees || 0) + (postBuildSetup || 0) + (turnkeyAllowance || 0);
  const buildTotalFunds = buildTotalProperty + buildStampDuty + buildSurcharge + buildSetup;
  const buildTargetLoan = Math.max(0, buildTotalFunds - (cashDeposit || 0) - buildFhbGrant);

  // Established Math
  const estPrice = establishedProperty?.purchasePrice || 0;
  const estStampDuty = calculateSaStampDuty(estPrice, false);
  const estSurcharge = estPrice * surchargeRate;
  const estSetup = (conveyancingFees || 0) + (establishedProperty?.renovationBuffer || 0);
  const estTotalFunds = estPrice + estStampDuty + estSurcharge + estSetup;
  const estTargetLoan = Math.max(0, estTotalFunds - (cashDeposit || 0));

  // Active View Fallbacks for Standard Dossier
  const activePropertyPrice = isEst ? estPrice : buildTotalProperty;
  const activeStampDuty = isEst ? estStampDuty : buildStampDuty;
  const activeSurcharge = isEst ? estSurcharge : buildSurcharge;
  const activeSetup = isEst ? estSetup : buildSetup;
  const activeTotalFunds = isEst ? estTotalFunds : buildTotalFunds;
  const activeTargetLoan = isEst ? estTargetLoan : buildTargetLoan;
  const activeLvr = activePropertyPrice > 0 ? (activeTargetLoan / activePropertyPrice) * 100 : 0;

  // --- REPAYMENT MATH ---
  const monthlyRate = (6.0 / 100) / 12;
  const termMonths = (loanTermYears || 30) * 12;
  const rType = repaymentType || 'PI';
  let activeRepayment = 0;
  if (activeTargetLoan > 0) {
    if (rType === 'IO') {
      activeRepayment = activeTargetLoan * monthlyRate;
    } else {
      activeRepayment = (activeTargetLoan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    }
  }

  // --- STRATEGIC INFERENCES (Restored) ---
  const advice: string[] = [];
  if (isBuild && isSaFhbEligible) {
    advice.push(`First Home Advantage: By building new in SA, you are saving on Stamp Duty and utilizing the $15,000 grant, drastically improving your cash position.`);
  }
  if (isEst && isSaFhbEligible) {
    advice.push(`SA FHB Alert: South Australia strictly charges full stamp duty on established homes. The $15k grant does not apply.`);
  }
  if (activeLvr > 80) {
    advice.push(`LMI Warning: Your estimated LVR is ${activeLvr.toFixed(1)}%. Because it is over 80%, you will likely need to pay LMI. Consider increasing your deposit.`);
  } else if (activeLvr > 0) {
    advice.push(`Healthy LVR: Your LVR is ${activeLvr.toFixed(1)}%, meaning you comfortably avoid Lenders Mortgage Insurance (LMI).`);
  }
  if (activeSurcharge > 0) {
    advice.push(`Surcharge Exposure: Your visa status triggers a ${(surchargeRate * 100).toFixed(1)}% foreign buyer surcharge ($${activeSurcharge.toLocaleString()}).`);
  }

  // --- DYNAMIC CONTRACT CLAUSES (The Legal Fortress Restored) ---
  const contractClauses = [
    { title: "INTRODUCTION AND ACCEPTANCE OF TERMS", text: "These Terms govern property strategy and consultation services provided by Mantej Singh (\"Consultant\"). By engaging our Services, paying consultation fees, or receiving documentation, you (\"Client\") agree to these Terms in full.", show: true },
    { title: "STRICTLY NO FINANCIAL, LEGAL, OR TAX ADVICE", text: "Services are strictly for educational and general strategic purposes. The Consultant is not a licensed financial advisor, mortgage broker, conveyancer, accountant, or legal practitioner. Figures provided do not constitute personal financial advice.", show: true },
    { title: "NATURE OF SERVICES AND LIMITATIONS OF ESTIMATIONS", text: "Services utilize analytical models based on generalized assumptions of the South Australian property market. All figures are estimations only and do not constitute fixed quotes or binding contracts.", show: true },
    { title: "TIME-SENSITIVITY OF DOSSIERS AND MARKET VOLATILITY", text: "Estimations represent a snapshot in time based on market conditions on the date of generation. Cost, interest rate, and legislation metrics are subject to change without notice.", show: true },
    { title: "CLIENT OBLIGATIONS AND ACCURACY OF DATA", text: "Estimations rely on the accuracy of Client-provided information. The Consultant does not independently audit Client data. Clients agree to seek verification from licensed professionals before executing contracts.", show: true },
    { title: "SCOPE OF ENGAGEMENT & FEES", text: "Payment entitles the Client strictly to the agreed consultation session and one (1) Strategy Dossier. Subsequent requests for updates constitute a new engagement. Fees are non-refundable once modeling is delivered.", show: true },
    { title: "CONFIDENTIALITY AND LIMITATION OF LIABILITY", text: "Client data is kept strictly confidential. To the maximum extent permitted by law, the Consultant shall not be liable for direct or indirect losses, loan rejections, or increased costs arising from reliance on the consultation.", show: true },
    { title: "INDEPENDENT OPERATION & CONFLICT OF INTEREST", text: "The Consultant provides these services as an independent contractor. This consultation is strictly independent and is not affiliated with, endorsed by, or representative of the Consultant's employer, Weeks Homes.", show: true },
    { title: "GOVERNMENT GRANTS, VISAS, AND TAXATION POLICIES", text: "Eligibility for grants, tax exemptions, and visa-related refunds is strictly determined by RevenueSA and the Department of Home Affairs. Clients must independently verify their eligibility as legislation is subject to change.", show: true },
    { title: "DATA PRIVACY AND SOFTWARE PROCESSING", text: "Client data entered during the consultation is processed locally within the web browser. The Consultant's software does not transmit, harvest, or store sensitive financial data on external servers.", show: true },
    
    // BUILD SPECIFIC
    { title: "GEOTECHNICAL AND SITE ENGINEERING LIMITATIONS", text: "The 'Adelaide Soil Reactivity Risk' buffer utilized is an estimation based on regional averages. It does not replace a formal geotechnical soil test. Actual site works can strictly only be finalized by a licensed builder.", show: isBuild || isCompare },
    { title: "DEVELOPER ENCUMBRANCES AND COUNCIL REGULATIONS", text: "Estimations provided do not account for hidden developer encumbrances, specific local council regulations, or National Construction Code orientation mandates.", show: isBuild || isCompare },
    { title: "BUILDER INSOLVENCY AND THIRD-PARTY DEFAULT", text: "The Consultant assumes no liability for the financial stability, performance, or solvency of any building company selected by the Client. The Client assumes all risks associated with builder insolvency and delays.", show: isBuild || isCompare },
    { title: "SEPARATION FROM PROJECT MANAGEMENT", text: "The Services are strictly limited to pre-construction strategy. The Consultant does not act as a project manager, client advocate, or site supervisor. The Client is solely responsible for execution.", show: isBuild || isCompare },
    { title: "NO GUARANTEE OF PROCUREMENT", text: "The provision of estimated costs does not constitute a guarantee that the Client will successfully secure land or building contracts at the stated prices.", show: isBuild || isCompare },
    
    // ESTABLISHED SPECIFIC
    { title: "INDEPENDENT BUILDING & PEST INSPECTIONS", text: "Estimations do not account for structural defects, termite damage, asbestos, or required remedial works. The Client assumes all risk and is strongly advised to obtain independent building and pest inspections.", show: isEst || isCompare },
    { title: "STRATA, BODY CORPORATE, AND SPECIAL LEVIES", text: "For established strata or community titles, estimated levies do not account for hidden sinking fund deficits or upcoming special levies. The Client must independently review all Corporation financials.", show: isEst || isCompare },
    { title: "UNAPPROVED COUNCIL STRUCTURES", text: "The Consultant makes no representations regarding the council compliance of existing extensions, sheds, pools, or modifications on the established property.", show: isEst || isCompare },

    // UNIVERSAL CLOSING
    { title: "BANK VALUATION SHORTFALL ACKNOWLEDGMENT", text: "The Consultant does not guarantee that a lending institution will value the completed or established property at this total cost. The Client acknowledges the inherent risk of bank valuation shortfalls.", show: true },
    { title: "EXCLUSION OF THIRD-PARTY RELIANCE", text: "This Strategy Dossier is prepared exclusively for the personal use of the named Client. It may not be relied upon by third parties for the purpose of extending credit or executing binding contracts.", show: true },
    { title: "LIMITATION OF LIABILITY CAP", text: "The Consultant's total aggregate liability for any claim, loss, or damage arising out of these Services shall be strictly limited to the total consultation fee paid by the Client.", show: true },
    { title: "INDEMNIFICATION", text: "The Client agrees to indemnify, defend, and hold harmless the Consultant from any claims, damages, liabilities, or legal fees arising from the Client's misuse of the Strategy Dossier.", show: true },
    { title: "ENTIRE AGREEMENT AND NO VERBAL PROMISES", text: "These Terms constitute the entire agreement between the Client and Consultant. Any verbal discussions or representations made during the session are expressly superseded by this written document.", show: true },
    { title: "GOVERNING LAW AND SEVERABILITY", text: "These Terms shall be governed by and construed in accordance with the laws of South Australia. Any legal disputes must be resolved exclusively in the courts of South Australia.", show: true },
    { title: "INTELLECTUAL PROPERTY", text: "The methodology, financial models, and layout contained within the Strategy Dossier remain the exclusive intellectual property of the Consultant. The Client may not reproduce or distribute it for commercial gain.", show: true },
  ];

  const activeClauses = contractClauses.filter(c => c.show);

  const dossierOnlyContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-50 p-8 font-sans text-slate-900 leading-snug">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          main { display: none !important; }
          body { background-color: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 10mm; size: A4 portrait; }
          .avoid-break { page-break-inside: avoid; }
        }
      `}} />

      <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-end avoid-break">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Property Strategy Dossier</h1>
          <p className="text-sm font-bold text-emerald-700 mt-1">Prepared for: {clientName}</p>
        </div>
        <div className="text-right text-xs text-slate-500 font-medium">
          <p>Date: {new Date().toLocaleDateString('en-AU')}</p>
          <p>Strategy: {isBuild ? 'Build New' : isEst ? 'Buy Established' : 'Comparative Analysis'}</p>
        </div>
      </div>

      {isCompare ? (
        <div className="space-y-6 avoid-break">
          <h3 className="text-lg uppercase tracking-widest font-black text-slate-800 border-b border-slate-200 pb-2">Side-by-Side Capital Matrix</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="border border-slate-300 p-4 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-900 text-base mb-4 uppercase">Option A: Build New</h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-slate-200"><td className="py-2">Total Property Value</td><td className="py-2 font-black text-right">${buildTotalProperty.toLocaleString()}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 text-emerald-700 font-bold">Stamp Duty (SA)</td><td className="py-2 font-black text-right text-emerald-700">${buildStampDuty.toLocaleString()}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2">Setup & Holding Buffers</td><td className="py-2 font-bold text-right">${buildSetup.toLocaleString()}</td></tr>
                  <tr><td className="py-2 text-slate-500">Target Loan Amount</td><td className="py-2 font-black text-right text-slate-900">${buildTargetLoan.toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="border border-indigo-200 p-4 rounded-xl bg-indigo-50">
              <h4 className="font-bold text-indigo-900 text-base mb-4 uppercase">Option B: Established</h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-indigo-100"><td className="py-2">Target Purchase Price</td><td className="py-2 font-black text-right">${estPrice.toLocaleString()}</td></tr>
                  <tr className="border-b border-indigo-100"><td className="py-2 text-red-600 font-bold">Stamp Duty (SA)</td><td className="py-2 font-black text-right text-red-600">${estStampDuty.toLocaleString()}</td></tr>
                  <tr className="border-b border-indigo-100"><td className="py-2">Immediate Repair Buffer</td><td className="py-2 font-bold text-right">${estSetup.toLocaleString()}</td></tr>
                  <tr><td className="py-2 text-indigo-700">Target Loan Amount</td><td className="py-2 font-black text-right text-indigo-900">${estTargetLoan.toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-xl mt-6">
            <p className="font-bold">Strategic Variance Summary:</p>
            <p className="text-sm mt-1 text-slate-300">
              Purchasing established incurs an additional <span className="text-red-400 font-black">${(estStampDuty - buildStampDuty).toLocaleString()}</span> in non-recoverable state taxes compared to building new in South Australia.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* RESTORED CAPITAL ALLOCATION VISUALIZER */}
          <div className="mb-6 avoid-break border border-slate-200 p-5 rounded-xl bg-slate-50">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-800 mb-3">Total Capital Allocation Visualizer</h3>
            <div className="w-full h-8 flex rounded overflow-hidden shadow-inner mb-3 bg-slate-200">
              {isBuild ? (
                <>
                  <div style={{ width: `${(buildLand / (activeTotalFunds || 1)) * 100}%` }} className="bg-sky-600 border-r border-white/20 h-full" />
                  <div style={{ width: `${(buildContract / (activeTotalFunds || 1)) * 100}%` }} className="bg-emerald-500 border-r border-white/20 h-full" />
                </>
              ) : (
                <div style={{ width: `${(estPrice / (activeTotalFunds || 1)) * 100}%` }} className="bg-indigo-600 border-r border-white/20 h-full" />
              )}
              <div style={{ width: `${(activeStampDuty / (activeTotalFunds || 1)) * 100}%` }} className="bg-amber-500 border-r border-white/20 h-full" />
              <div style={{ width: `${(activeSurcharge / (activeTotalFunds || 1)) * 100}%` }} className="bg-red-500 border-r border-white/20 h-full" />
              <div style={{ width: `${(activeSetup / (activeTotalFunds || 1)) * 100}%` }} className="bg-slate-500 h-full" />
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
              {isBuild ? (
                <><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-sky-600 rounded-sm" /> Land</div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Build</div></>
              ) : (
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm" /> Property</div>
              )}
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Duty</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-slate-500 rounded-sm" /> Fees</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 avoid-break">
            <div className="border border-slate-200 p-3 rounded-xl text-center bg-white">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Property Value</p>
              <p className="text-xl font-black text-slate-900">${activePropertyPrice.toLocaleString()}</p>
            </div>
            <div className="border border-slate-200 p-3 rounded-xl text-center bg-white">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cash Required</p>
              <p className="text-xl font-black text-slate-900">${activeTotalFunds.toLocaleString()}</p>
            </div>
            <div className="border border-emerald-200 p-3 rounded-xl text-center bg-emerald-50">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">Target Loan</p>
              <p className="text-xl font-black text-emerald-600">${activeTargetLoan.toLocaleString()}</p>
            </div>
          </div>

          {/* RESTORED ADVICE ARRAY */}
          <div className="mb-6 avoid-break border-l-4 border-emerald-500 bg-slate-50 p-4 rounded-r-xl">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-800 mb-2">Strategic Inferences & Notes</h3>
            <ul className="space-y-2">
              {advice.map((tip, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start">
                  <span className="mr-2 text-emerald-500 font-bold">→</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-800 mb-3 border-b border-slate-200 pb-1">Parameters Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 avoid-break text-xs">
            <div className="bg-white p-3 rounded border border-slate-200">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">Profile & Math</h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Visa Status</td><td className="py-1 font-bold text-right">{visaStatus.applicant1?.visa || 'N/A'}</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Combined Income</td><td className="py-1 font-bold text-right">${((current.applicant1Income||0)+(current.applicant2Income||0)).toLocaleString()}</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Cash Deposit</td><td className="py-1 font-bold text-right text-emerald-600">${(cashDeposit || 0).toLocaleString()}</td></tr>
                  {isBuild && isSaFhbEligible && (
                    <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">SA FHB Grant</td><td className="py-1 font-bold text-right text-emerald-600">$15,000</td></tr>
                  )}
                  <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Est. Repayment ({loanTermYears}yr {repaymentType} @ 6%)</td><td className="py-1 font-bold text-right">${Math.round(activeRepayment).toLocaleString()} /mo</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white p-3 rounded border border-slate-200">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">{isBuild ? 'Build Breakdown' : 'Established Breakdown'}</h4>
              <table className="w-full">
                <tbody>
                  {isBuild ? (
                    <>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Land Price</td><td className="py-1 font-bold text-right">${buildLand.toLocaleString()}</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Base Build</td><td className="py-1 font-bold text-right">${(property?.buildPrice || 0).toLocaleString()}</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Site Works</td><td className="py-1 font-bold text-right">${(property?.siteWorks || 0).toLocaleString()}</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Soil/Risk Buffer</td><td className="py-1 font-bold text-right">${getSoilBuffer(property?.soilClassificationRisk || 'Unknown').toLocaleString()}</td></tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Target Purchase Price</td><td className="py-1 font-bold text-right">${estPrice.toLocaleString()}</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Yearly Strata/Body Corp</td><td className="py-1 font-bold text-right">${(establishedProperty?.strataYearly || 0).toLocaleString()}</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1 text-slate-600">Settlement Timeframe</td><td className="py-1 font-bold text-right">{establishedProperty?.settlementDays || 30} Days</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const termsOnlyContent = (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-50 p-8 font-sans text-slate-900 leading-snug">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          main { display: none !important; }
          body { background-color: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 10mm; size: A4 portrait; }
          .avoid-break { page-break-inside: avoid; }
        }
      `}} />

      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900 uppercase">Terms & Conditions of Consultation</h2>
          <p className="text-xs text-slate-600 mt-1">Prepared for: <span className="font-bold text-slate-900">{clientName}</span></p>
        </div>
        <p className="text-xs text-slate-400 font-medium">Date: {new Date().toLocaleDateString('en-AU')}</p>
      </div>

      <div className="space-y-3 text-[10px] text-slate-700 leading-normal">
        {/* DYNAMIC CONTRACT CLAUSES MAPPED PERFECTLY */}
        {activeClauses.map((clause, index) => (
          <div key={index} className="avoid-break">
            <h4 className="font-bold text-slate-900 uppercase">{index + 1}. {clause.title}</h4>
            <p>{clause.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-2 border-slate-900 p-4 rounded-xl bg-slate-50 avoid-break">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">Client Acknowledgment & Declaration</h4>
        <p className="text-[10px] text-slate-600 mb-4">By signing below or replying via email accepting this agreement, I, <strong className="text-slate-900">{clientName}</strong>, confirm that I have read, understood, and agreed to the Terms and Conditions above. I acknowledge that Mantej Singh is providing general property estimations and is not a licensed financial advisor.</p>
        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-300">
          <div><p className="text-[9px] font-bold text-slate-500 uppercase">Client Signature</p><div className="h-8 border-b border-slate-400 mt-1"></div></div>
          <div><p className="text-[9px] font-bold text-slate-500 uppercase">Date</p><div className="h-8 border-b border-slate-400 mt-1"></div></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 print:hidden">
      <button onClick={() => handlePrint('dossier')} className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
        <FileText className="w-4 h-4" />
        <span className="font-semibold text-xs md:text-sm">Download Dossier</span>
      </button>

      <button onClick={() => handlePrint('terms')} className="flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-200 transition-colors">
        <FileCheck className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold text-xs md:text-sm">Download T&amp;C</span>
      </button>

      {mounted && printMode === 'dossier' && createPortal(dossierOnlyContent, document.body)}
      {mounted && printMode === 'terms' && createPortal(termsOnlyContent, document.body)}
    </div>
  );
}