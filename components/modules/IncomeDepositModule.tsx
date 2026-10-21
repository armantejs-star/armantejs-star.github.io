'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Tooltip } from '@/components/ui/Tooltip';

export function IncomeDepositModule() {
  const { current, setAppState } = useAppStore();
  
  const clientName = (current as unknown as { clientName?: string }).clientName || '';
  const income1 = current.applicant1Income || 0;
  const income2 = current.applicant2Income || 0;
  const deposit = current.cashDeposit || 0;
  const expenses = current.annualLivingExpenses || 0;
  
  const isJointPurchase = current.visaStatus?.isJointPurchase || false;

  // NEW LOAN DATA
  const loanTermYears = current.loanTermYears || 30;
  const repaymentType = current.repaymentType || 'PI';

  const updateState = (key: string, value: string | number) => {
    setAppState({ [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Income, Funds & Loan Setup</h2>
        <Tooltip text="Configure client income, deposit, and targeted loan preferences." />
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

          <CurrencyInput 
            label="Estimated Annual Living Expenses" 
            value={expenses} 
            onChange={(v) => updateState('annualLivingExpenses', v)} 
          />
        </div>

        {/* NEW LOAN PREFERENCES SECTION */}
        <div className="border-t border-slate-100 pt-4 mt-2">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Proposed Loan Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">Loan Term (Years)</label>
              <input 
                type="number"
                min="10"
                max="40"
                value={loanTermYears || ''}
                onChange={(e) => updateState('loanTermYears', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 text-sm shadow-sm"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">Repayment Type</label>
              <select 
                value={repaymentType}
                onChange={(e) => updateState('repaymentType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 text-sm cursor-pointer shadow-sm"
              >
                <option value="PI">Principal & Interest (P&I)</option>
                <option value="IO">Interest Only (IO)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}