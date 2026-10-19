'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Tooltip } from '@/components/ui/Tooltip';

export function IncomeDepositModule() {
  const { current, setAppState } = useAppStore();
  
  // FIX: Replaced 'any' with strict unknown casting to satisfy ESLint
  const clientName = (current as unknown as { clientName?: string }).clientName || '';
  const income1 = current.applicant1Income || 0;
  const income2 = current.applicant2Income || 0;
  const deposit = current.cashDeposit || 0;
  const expenses = current.annualLivingExpenses || 0;
  
  const isJointPurchase = current.visaStatus?.isJointPurchase || false;

  const updateState = (key: string, value: string | number) => {
    setAppState({ [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Income & Funds</h2>
        <Tooltip text="These figures are tested against APRA's +3.0% interest rate buffer to calculate maximum borrowing capacity." />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Client / Applicant Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            value={clientName}
            onChange={(e) => updateState('clientName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 text-sm shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <CurrencyInput 
            label="Applicant 1 Gross Annual Income" 
            value={income1} 
            onChange={(v) => updateState('applicant1Income', v)} 
          />
          
          {isJointPurchase && (
            <CurrencyInput 
              label="Applicant 2 Gross Annual Income" 
              value={income2} 
              onChange={(v) => updateState('applicant2Income', v)} 
            />
          )}
          
          <CurrencyInput 
            label="Available Cash Deposit" 
            value={deposit} 
            onChange={(v) => updateState('cashDeposit', v)} 
          />

          <div className="md:col-span-2 mt-2">
            <CurrencyInput 
              label="Estimated Annual Living Expenses" 
              value={expenses} 
              onChange={(v) => updateState('annualLivingExpenses', v)} 
            />
            <p className="text-xs text-slate-500 mt-2">
              * Banks will use this figure or the standard HEM (Household Expenditure Measure) benchmark, whichever is higher.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}