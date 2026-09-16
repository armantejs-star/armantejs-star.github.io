'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Tooltip } from '@/components/ui/Tooltip';

export function IncomeDepositModule() {
  const { current, setAppState } = useAppStore();
  
  // We initialize these to 0 if they don't exist in the current state yet
  const income = current.applicant1Income || 0;
  const deposit = current.cashDeposit || 0;
  const expenses = current.annualLivingExpenses || 0;

  const updateState = (key: string, value: number) => {
    setAppState({ [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Income & Funds</h2>
        <Tooltip text="These figures are tested against APRA's +3.0% interest rate buffer to calculate maximum borrowing capacity." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrencyInput 
          label="Applicant 1 Gross Annual Income" 
          value={income} 
          onChange={(v) => updateState('applicant1Income', v)} 
        />
        
        <CurrencyInput 
          label="Available Cash Deposit" 
          value={deposit} 
          onChange={(v) => updateState('cashDeposit', v)} 
        />

        <div className="md:col-span-2">
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
    </Card>
  );
}