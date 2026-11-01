'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Home, AlertOctagon } from 'lucide-react';

export function EstablishedPropertyModule() {
  const { current, setAppState } = useAppStore();
  const { establishedProperty, visaStatus } = current;

  // Identify if any applicant is on a Temporary Visa (Not Citizen or PR)
  const isTemp = (visa?: string) => visa && !['Citizen', 'PR', 'Permanent Resident'].includes(visa);
  const isTemporaryResident = isTemp(visaStatus?.applicant1?.visa) || isTemp(visaStatus?.applicant2?.visa);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Home className="w-5 h-5 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-800">Target Established Property</h2>
      </div>

      {isTemporaryResident && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-red-700">FIRB Restriction Alert (Established Dwellings)</h3>
            <p className="text-xs mt-1 text-red-900 leading-relaxed font-medium">
              Under federal FIRB legislation, temporary residents are strictly restricted from purchasing established dwellings as investment properties. You must build new or purchase brand-new construction to comply with Australian federal law.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Target Purchase Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
            <input
              type="number"
              value={establishedProperty?.purchasePrice || ''}
              onChange={(e) => setAppState({ establishedProperty: { ...establishedProperty, purchasePrice: Number(e.target.value) }})}
              className="w-full pl-7 pr-3 py-2 bg-slate-100 border-none rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 650000"
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Immediate Repair Buffer</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
            <input
              type="number"
              value={establishedProperty?.renovationBuffer || ''}
              onChange={(e) => setAppState({ establishedProperty: { ...establishedProperty, renovationBuffer: Number(e.target.value) }})}
              className="w-full pl-7 pr-3 py-2 bg-slate-100 border-none rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 15000"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Yearly Strata / Body Corp</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
            <input
              type="number"
              value={establishedProperty?.strataYearly || ''}
              onChange={(e) => setAppState({ establishedProperty: { ...establishedProperty, strataYearly: Number(e.target.value) }})}
              className="w-full pl-7 pr-3 py-2 bg-slate-100 border-none rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500"
              placeholder="Leave blank if Torrens Title"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Expected Settlement</label>
          <select
            value={establishedProperty?.settlementDays || 30}
            onChange={(e) => setAppState({ establishedProperty: { ...establishedProperty, settlementDays: Number(e.target.value) }})}
            className="w-full px-3 py-2 bg-slate-100 border-none rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500"
          >
            <option value={30}>30 Days</option>
            <option value={45}>45 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>
      </div>
    </Card>
  );
}