export function calculateSaStampDuty(landPrice: number, isSaFhbEligible: boolean = false): number {
  // SA First Home Buyer Exemption (Abolished stamp duty for new builds)
  if (isSaFhbEligible) {
    return 0; 
  }

  // Standard SA Revenue Brackets
  if (landPrice <= 12000) return landPrice * 0.01;
  if (landPrice <= 32000) return 120 + (landPrice - 12000) * 0.02;
  if (landPrice <= 50000) return 520 + (landPrice - 32000) * 0.03;
  if (landPrice <= 100000) return 1060 + (landPrice - 50000) * 0.04;
  if (landPrice <= 200000) return 3060 + (landPrice - 100000) * 0.04;
  if (landPrice <= 250000) return 7060 + (landPrice - 200000) * 0.0425;
  if (landPrice <= 300000) return 9185 + (landPrice - 250000) * 0.0475;
  if (landPrice <= 500000) return 11560 + (landPrice - 300000) * 0.05;
  
  return 21560 + (landPrice - 500000) * 0.055;
}