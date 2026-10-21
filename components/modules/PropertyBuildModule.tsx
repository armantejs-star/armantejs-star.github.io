'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Tooltip } from '@/components/ui/Tooltip';
import { SoilClass } from '@/constants/soil';

export function PropertyBuildModule() {
  const { current, setAppState } = useAppStore();
  const { property } = current;

  const isSaFhbEligible = current.isSaFhbEligible || false;
  const turnkeyAllowance = current.turnkeyAllowance || 0;
  const buildDurationMonths = current.buildDurationMonths || 0; // fallback to 0

  const updateProperty = (key: keyof typeof property, value: number | string) => {
    setAppState({
      property: {
        ...property,
        [key]: value
      }
    });
  };

  const updateRoot = (key: string, value: string | number | boolean) => {
    setAppState({ [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Property & Build Contract</h2>
        <Tooltip text="Enter your land and fixed-price build details here. Stamp duty is only calculated on the land price for new builds." />
      </div>

      <div className="flex items-center space-x-4 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
        <input
          type="checkbox"
          id="fhb-toggle"
          checked={isSaFhbEligible}
          onChange={(e) => updateRoot('isSaFhbEligible', e.target.checked)}
          className="w-5 h-5 text-emerald-600 rounded border-emerald-400 focus:ring-emerald-500 cursor-pointer"
        />
        <div className="flex flex-col">
          <label htmlFor="fhb-toggle" className="text-sm font-bold text-emerald-900 cursor-pointer">
            Eligible for SA First Home Buyer Exemption & $15k Grant
          </label>
          <p className="text-xs text-emerald-700 mt-0.5">
            Automatically zeroes out stamp duty and reduces the required loan amount by the $15,000 grant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <CurrencyInput 
          label="Land Purchase Price" 
          value={property.landPrice} 
          onChange={(v) => updateProperty('landPrice', v)} 
        />
        <CurrencyInput 
          label="Base Build Contract Price" 
          value={property.buildPrice} 
          onChange={(v) => updateProperty('buildPrice', v)} 
        />
        <CurrencyInput 
          label="Site Works & Upgrades" 
          value={property.siteWorks} 
          onChange={(v) => updateProperty('siteWorks', v)} 
        />
        <CurrencyInput 
          label="7-Star NatHERS Upgrade Cost" 
          value={property.nathers7StarUpgrade} 
          onChange={(v) => updateProperty('nathers7StarUpgrade', v)} 
        />
        
        <div className="md:col-span-1 border-t border-slate-100 pt-4 md:border-none md:pt-0">
          <CurrencyInput 
            label="Post-Handover Turnkey Buffer" 
            value={turnkeyAllowance} 
            onChange={(v) => updateRoot('turnkeyAllowance', v)} 
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Cash reserved for perimeter fencing, basic landscaping, and blinds.
          </p>
        </div>

        <div className="md:col-span-1 border-t border-slate-100 pt-4 md:border-none md:pt-0 flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Est. Build Duration (Months)
            <Tooltip text="Used to calculate the overlapping cashflow stress of paying rent + loan interest simultaneously." />
          </label>
          <input 
            type="number"
            min="1"
            max="36"
            /* FIX: If it is 0, show an empty string so they can type cleanly */
            value={buildDurationMonths || ''}
            onChange={(e) => updateRoot('buildDurationMonths', Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Adelaide Soil Reactivity Risk
          </label>
          <select 
            value={property.soilClassificationRisk}
            onChange={(e) => updateProperty('soilClassificationRisk', e.target.value as SoilClass)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 mt-1 cursor-pointer text-sm"
          >
            <option value="Low">Low (Class A, S) - Standard Footings</option>
            <option value="Medium">Medium (Class M) - Moderately Reactive ($15k Buffer)</option>
            <option value="High">High (Class H1/H2/E) - Highly Reactive ($35k Buffer)</option>
            <option value="Unknown">Unknown - Pre-Soil Test ($25k Buffer)</option>
          </select>
        </div>
      </div>
    </Card>
  );
}