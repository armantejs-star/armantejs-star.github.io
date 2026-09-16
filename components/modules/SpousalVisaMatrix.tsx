'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { VisaSubclass } from '@/types/types';

const VISA_OPTIONS: VisaSubclass[] = ["Citizen", "PR", "190", "491", "Foreign", "Other"];

export function SpousalVisaMatrix() {
  // We hook into our Zustand brain here
  const { current, setAppState } = useAppStore();
  const { visaStatus } = current;

  // Function to update Applicant 1
  const handleApplicant1Visa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppState({
      visaStatus: {
        ...visaStatus,
        applicant1: { ...visaStatus.applicant1, visa: e.target.value as VisaSubclass }
      }
    });
  };

  // Function to toggle joint purchase
  const toggleJointPurchase = () => {
    const isJoint = !visaStatus.isJointPurchase;
    setAppState({
      visaStatus: {
        ...visaStatus,
        isJointPurchase: isJoint,
        // Auto-populate a default secondary applicant if toggled on
        applicant2: isJoint ? { visa: "Citizen", isFirstHomeBuyer: true } : undefined
      }
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Visa & Ownership Matrix</h2>
        <Tooltip text="SA Revenue uses visa status at the time of settlement to apply the 7% surcharge." />
      </div>

      <div className="space-y-4">
        {/* Applicant 1 Input */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-slate-700">Applicant 1 Visa</label>
          <select 
            value={visaStatus.applicant1.visa}
            onChange={handleApplicant1Visa}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
          >
            {VISA_OPTIONS.map(visa => <option key={visa} value={visa}>{visa}</option>)}
          </select>
        </div>

        {/* Joint Purchase Checkbox */}
        <div className="flex items-center space-x-3 pt-2">
          <input 
            type="checkbox" 
            id="jointToggle"
            checked={visaStatus.isJointPurchase}
            onChange={toggleJointPurchase}
            className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="jointToggle" className="text-sm font-medium text-slate-700 cursor-pointer">
            Add Secondary Applicant (Spouse/Partner)
          </label>
        </div>

        {/* Applicant 2 Input (Only shows if joint purchase is checked) */}
        {visaStatus.isJointPurchase && visaStatus.applicant2 && (
          <div className="flex flex-col space-y-1 p-4 bg-slate-50 rounded-lg border border-slate-200 mt-4">
            <label className="text-sm font-medium text-slate-700">Applicant 2 Visa</label>
            <select 
              value={visaStatus.applicant2.visa}
              onChange={(e) => setAppState({
                visaStatus: {
                  ...visaStatus,
                  applicant2: { ...visaStatus.applicant2!, visa: e.target.value as VisaSubclass }
                }
              })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            >
              {VISA_OPTIONS.map(visa => <option key={visa} value={visa}>{visa}</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              * If purchasing as 50/50 Joint Tenants, SA Revenue only applies the surcharge to the temporary resident's share.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}