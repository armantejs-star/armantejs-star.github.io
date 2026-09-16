// constants/visa.ts

export const SA_FOREIGN_SURCHARGE_RATE = 0.07; // 7% of property value in South Australia

export interface FirbTier {
  maxPropertyPrice: number;
  fee: number;
}

// FIRB Application Fees
export const FIRB_FEE_TIERS: FirbTier[] = [
  { maxPropertyPrice: 1000000, fee: 15600 },
  { maxPropertyPrice: 2000000, fee: 31300 },
  { maxPropertyPrice: 3000000, fee: 62600 },
  { maxPropertyPrice: 4000000, fee: 93900 },
  { maxPropertyPrice: 5000000, fee: 125200 },
  { maxPropertyPrice: Infinity, fee: 156500 }, // Caps for most standard residential logic
];

/**
 * Calculates the FIRB fee based on the total property price (Land + Build).
 */
export function calculateFirbFee(propertyPrice: number): number {
  if (propertyPrice <= 0) return 0;
  
  const tier = FIRB_FEE_TIERS.find(t => propertyPrice <= t.maxPropertyPrice);
  return tier ? tier.fee : 156500;
}