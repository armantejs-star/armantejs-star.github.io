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

  // A smart helper function to update only the specific property field that changed
  const updateProperty = (key: keyof typeof property, value: number | string) => {
    setAppState({
      property: {
        ...property,
        [key]: value
      }
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Property & Build Contract</h2>
        <Tooltip text="Enter your land and fixed-price build details here. Stamp duty is only calculated on the land price for new builds." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Adelaide Soil Reactivity Risk
            <Tooltip text="Adelaide is notorious for reactive clay. Class H/E requires deeper footings, often adding $20k-$40k post-contract." />
          </label>
          <select 
            value={property.soilClassificationRisk}
            onChange={(e) => updateProperty('soilClassificationRisk', e.target.value as SoilClass)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 mt-1 cursor-pointer"
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