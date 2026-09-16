// lib/math/loan.ts

/**
 * Calculates max borrowing capacity based on net income, living expenses, 
 * and APRA's mandatory interest rate stress buffer (+3.0%).
 */
export function calculateBorrowingCapacity(
  netAnnualIncome: number,
  annualLivingExpenses: number,
  baseInterestRate: number = 0.06 // 6% baseline
): number {
  if (netAnnualIncome <= 0) return 0;

  // APRA buffer requirement: lenders test at base rate + 3%
  const stressedRate = baseInterestRate + 0.03;
  const monthlyStressedRate = stressedRate / 12;
  
  // Available monthly surplus for mortgage repayments
  const monthlyIncome = netAnnualIncome / 12;
  const monthlyExpenses = annualLivingExpenses / 12;
  const monthlySurplus = monthlyIncome - monthlyExpenses;

  if (monthlySurplus <= 0) return 0;

  // Standard 30-year mortgage calculation under stressed conditions
  const loanTermMonths = 360;
  const maxLoan = 
    (monthlySurplus * (1 - Math.pow(1 + monthlyStressedRate, -loanTermMonths))) / 
    monthlyStressedRate;

  return Math.max(0, Math.round(maxLoan));
}

/**
 * Calculates Lenders Mortgage Insurance (LMI) tier based on Loan-to-Value Ratio (LVR).
 * If LVR is <= 80%, LMI is $0.
 */
export function calculateLmi(propertyValue: number, loanAmount: number): number {
  if (propertyValue <= 0 || loanAmount <= 0) return 0;

  const lvr = (loanAmount / propertyValue) * 100;

  if (lvr <= 80) return 0;
  if (lvr > 80 && lvr <= 85) return propertyValue * 0.02; // ~2% of property value
  if (lvr > 85 && lvr <= 90) return propertyValue * 0.035; // ~3.5%
  if (lvr > 90) return propertyValue * 0.05; // ~5% for high-risk low-deposit loans

  return 0;
}