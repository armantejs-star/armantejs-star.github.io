// constants/tax.ts

export const MEDICARE_LEVY_RATE = 0.02; // 2%

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
}

// Current ATO Stage 3 Tax Cuts
export const ATO_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 18200, rate: 0.00, baseTax: 0 },
  { min: 18201, max: 45000, rate: 0.16, baseTax: 0 },
  { min: 45001, max: 135000, rate: 0.30, baseTax: 4288 },
  { min: 135001, max: 190000, rate: 0.37, baseTax: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, baseTax: 51638 },
];

/**
 * Calculates standard net income after tax and Medicare levy.
 */
export function calculateNetIncome(grossIncome: number): number {
  if (grossIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of ATO_TAX_BRACKETS) {
    if (grossIncome > bracket.min) {
      const taxableAmountInBracket = Math.min(grossIncome, bracket.max) - bracket.min;
      
      // Use the baseTax of the bracket if we are fully into it, otherwise calculate the marginal edge
      if (grossIncome <= bracket.max) {
        tax = bracket.baseTax + (taxableAmountInBracket * bracket.rate);
        break;
      }
    }
  }

  // Medicare Levy (simplified, ignoring low-income phase-in thresholds for baseline strategy)
  const medicare = grossIncome > 30000 ? grossIncome * MEDICARE_LEVY_RATE : 0;

  return grossIncome - tax - medicare;
}