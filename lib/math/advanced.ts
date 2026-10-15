// lib/math/advanced.ts

/**
 * Calculates the inflated build price based on delays before construction starts.
 */
export function calculateEscalatedBuild(baseBuild: number, delayMonths: number, escalationPct: number): number {
  if (delayMonths <= 0 || escalationPct <= 0) return baseBuild;
  return baseBuild * Math.pow(1 + (escalationPct / 100 / 12), delayMonths);
}

/**
 * Calculates automated FIRB Application Fees based on property value tiers.
 * Temporary residents pay this fee for permission to buy.
 */
export function calculateFirbFee(totalPropertyValue: number, isTemporaryResident: boolean): number {
  if (!isTemporaryResident) return 0;
  // Current FIRB fee tier threshold (simplified)
  return totalPropertyValue <= 1000000 ? 15600 : 31300;
}

/**
 * Calculates holding costs across two distinct phases: 
 * Phase 1 (Land titled, waiting to build) and Phase 2 (Construction phase).
 */
export function calculateHoldingCosts(
  landDrawnDown: number, 
  totalLoan: number, 
  delayMonths: number, 
  buildMonths: number = 9, 
  interestRate: number = 6.5,
  monthlyRent: number,
  yearlyRates: number
) {
  const rateM = (interestRate / 100) / 12;

  // Phase 1: Paying rent + interest on the land loan + council rates
  const phase1Interest = landDrawnDown * rateM * delayMonths;
  const phase1Rent = monthlyRent * delayMonths;
  const phase1Rates = yearlyRates * (delayMonths / 12);
  const phase1Total = phase1Interest + phase1Rent + phase1Rates;

  // Phase 2: Paying rent + progressive interest on the full construction loan
  // We multiply by 0.5 as a standard estimation for progressive drawdowns
  const phase2Interest = totalLoan * rateM * buildMonths * 0.5;
  const phase2Rent = monthlyRent * buildMonths;
  const phase2Rates = yearlyRates * (buildMonths / 12);
  const phase2Total = phase2Interest + phase2Rent + phase2Rates;

  return {
    phase1Total,
    phase2Total,
    grandTotal: phase1Total + phase2Total
  };
}

/**
 * Calculates the 'Opportunity Cost' ETF Strategy.
 * Returns how much the upfront cash would grow if invested in the stock market instead of buying a house.
 */
export function calculateEtfOpportunity(upfrontCash: number, waitMonths: number, etfReturnPct: number): number {
  if (waitMonths <= 0 || etfReturnPct <= 0 || upfrontCash <= 0) return 0;
  return upfrontCash * (Math.pow(1 + (etfReturnPct / 100 / 12), waitMonths) - 1);
}