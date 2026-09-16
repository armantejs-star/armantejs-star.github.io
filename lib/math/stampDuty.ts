// lib/math/stampDuty.ts

/**
 * Calculates standard South Australian Stamp Duty on land purchase price.
 */
export function calculateSaStampDuty(landPrice: number): number {
  if (landPrice <= 0) return 0;

  // Simplified progressive SA stamp duty brackets for residential land
  if (landPrice <= 12000) return landPrice * 0.01;
  if (landPrice <= 30000) return 120 + ((landPrice - 12000) * 0.02);
  if (landPrice <= 50000) return 480 + ((landPrice - 30000) * 0.03);
  if (landPrice <= 100000) return 1080 + ((landPrice - 50000) * 0.035);
  if (landPrice <= 200000) return 2830 + ((landPrice - 100000) * 0.04);
  if (landPrice <= 250000) return 6830 + ((landPrice - 200000) * 0.0425);
  if (landPrice <= 300000) return 8955 + ((landPrice - 250000) * 0.0475);
  if (landPrice <= 500000) return 11330 + ((landPrice - 300000) * 0.05);
  if (landPrice <= 1000000) return 21330 + ((landPrice - 500000) * 0.055);
  
  // Over $1M bracket
  return 48830 + ((landPrice - 1000000) * 0.055);
}