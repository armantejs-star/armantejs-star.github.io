'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Scale, 
  PieChart, 
  Download, 
  ChevronDown, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface GuideSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}

function GuideSection({ title, icon, children, isOpenDefault = false }: GuideSectionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900 text-white rounded-lg">{icon}</div>
          <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
      </button>

      {isOpen && (
        <div className="p-5 text-slate-600 text-sm leading-relaxed space-y-4 border-t border-slate-200 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export function TutorialGuide() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-7 h-7 text-emerald-400" />
          <h2 className="text-2xl font-extrabold tracking-tight">Broke Builder: The Official Survival Guide</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Building a house is a financial minefield of hidden fees, builder escalations, and bank stress tests. This tool is designed to strip away the sales pitches and show you exactly what it will cost, what the bank will actually lend you, and whether you are better off buying now or waiting.
        </p>
      </div>

      <GuideSection title="1. Property & Construction Baseline" icon={<Home className="w-5 h-5" />} isOpenDefault={true}>
        <p>This is where you set the foundation of your project before things get complicated.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-slate-900">Land & Build Price:</strong> Enter the sticker price of the land and the base builder's contract.</li>
          <li><strong className="text-slate-900">Soil Risk Level:</strong> Select your expected soil class. If you choose highly reactive clay (Class H/P), the engine automatically calculates a realistic contingency buffer for upgraded footings so you don't get a shock later.</li>
          <li><strong className="text-slate-900">Site Works & Energy Upgrades:</strong> Factor in the mandatory extra costs for 7-Star NatHERS compliance and general site preparation (retaining walls, leveling).</li>
        </ul>
      </GuideSection>

      <GuideSection title="2. The Delay & Escalation Trap" icon={<TrendingUp className="w-5 h-5" />}>
        <p>Builders often quote today's price, but if your land takes 9 months to title, that price <em>will</em> go up.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-slate-900">Pre-Build Delay:</strong> Use the slider to estimate how many months you will be waiting for your land to title or for council approvals.</li>
          <li><strong className="text-slate-900">Builder Price Escalation:</strong> Enter the annual inflation rate for construction materials. The engine will compound this percentage over your delay period to show you the <em>true</em> escalated contract price you will be forced to pay by the time the slab is poured.</li>
        </ul>
      </GuideSection>

      <GuideSection title="3. The APRA Reality Check" icon={<DollarSign className="w-5 h-5" />}>
        <p>This module calculates what the bank will actually let you borrow, not what you <em>want</em> to borrow.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-slate-900">Income & Debts:</strong> Enter your gross household income and all current debt limits. <em>Note: Always enter the total limit of your credit cards, not your current balance, as banks assess the full limit.</em></li>
          <li><strong className="text-slate-900">The APRA Buffer:</strong> The engine automatically deducts income tax (ATO Stage 3), subtracts the Medicare levy, and applies the mandatory APRA stress test (adding +3.0% to standard interest rates) to find your absolute maximum borrowing ceiling.</li>
        </ul>
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="font-bold text-slate-900 mb-2">Health Gauge Zones:</p>
          <ul className="space-y-1 text-xs">
            <li><span className="text-emerald-600 font-bold">Green:</span> Your required loan is well within your limits.</li>
            <li><span className="text-amber-600 font-bold">Yellow:</span> You are pushing up against the edge of your borrowing power.</li>
            <li><span className="text-red-600 font-bold">Red:</span> The bank will decline this loan. You need a bigger deposit or a cheaper build.</li>
          </ul>
        </div>
      </GuideSection>

      <GuideSection title="4. The Strategy Engine (Buy Now vs. Wait)" icon={<Scale className="w-5 h-5" />}>
        <p>If you are struggling to afford the build right now, this module compares the financial impact of jumping in today versus waiting and investing your deposit elsewhere.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-slate-900">Wait Time:</strong> How long you plan to hold off on buying.</li>
          <li><strong className="text-slate-900">Property vs. ETF Returns:</strong> Compare the projected growth of the property market against the expected returns of putting your cash deposit into an Index Fund/ETF while you wait.</li>
          <li><strong className="text-slate-900">The Verdict:</strong> The engine will calculate the "Opportunity Cost" and tell you exactly how much equity you lose (or gain) by delaying the build.</li>
        </ul>
      </GuideSection>

      <GuideSection title="5. Construction Drawdowns & Capital Allocation" icon={<PieChart className="w-5 h-5" />}>
        <p>A visual breakdown of exactly when your money leaves your pocket.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-slate-900">The 5-Stage Breakdown:</strong> Watch how your loan is distributed across standard builder invoices: Deposit (5%), Base/Slab (20%), Frame (25%), Lock-Up (20%), and Fixing/Completion (30%).</li>
          <li><strong className="text-slate-900">Progressive Interest:</strong> Understand how your interest-only repayments will slowly increase as the bank releases more funds at each stage of construction.</li>
        </ul>
      </GuideSection>

      <GuideSection title="6. Utilities (Export & Offline Mode)" icon={<Download className="w-5 h-5" />}>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-slate-900">Export to PDF:</strong> Click this to generate a clean, professional executive summary of your entire financial strategy. Perfect for taking to a mortgage broker or financial advisor.</li>
          <li><strong className="text-slate-900">Export to CSV:</strong> Dumps all the raw math and metrics into a spreadsheet for your own records.</li>
          <li><strong className="text-slate-900">Offline Mode:</strong> Tap "Install App" on your phone. Broke Builder will save to your home screen and run entirely offline, meaning you can calculate site costs while standing on a vacant block of land with zero reception.</li>
        </ul>
      </GuideSection>
    </div>
  );
}