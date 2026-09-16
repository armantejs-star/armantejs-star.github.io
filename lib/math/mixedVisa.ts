// lib/math/mixedVisa.ts

import { SpousalVisaStatus } from '@/types/types';
import { SA_FOREIGN_SURCHARGE_RATE } from '@/constants/visa';

/**
 * Calculates the effective foreign surcharge rate based on ownership split.
 * In SA, if purchasing as joint tenants (50/50), the surcharge only applies 
 * to the temporary resident's share.
 */
export function calculateEffectiveSurchargeRate(visaStatus: SpousalVisaStatus): number {
  const isApp1Foreign = ["491", "Foreign", "Other"].includes(visaStatus.applicant1.visa);
  
  // Single applicant scenario
  if (!visaStatus.isJointPurchase || !visaStatus.applicant2) {
    return isApp1Foreign ? SA_FOREIGN_SURCHARGE_RATE : 0;
  }

  const isApp2Foreign = ["491", "Foreign", "Other"].includes(visaStatus.applicant2.visa);

  // Scenario 1: Both are temporary/foreign = full 7% surcharge
  if (isApp1Foreign && isApp2Foreign) {
    return SA_FOREIGN_SURCHARGE_RATE;
  }
  
  // Scenario 2: One is a Citizen/PR, one is temporary = 3.5% (half surcharge)
  if (isApp1Foreign || isApp2Foreign) {
    return SA_FOREIGN_SURCHARGE_RATE / 2;
  }

  // Scenario 3: Both are Citizen/PR = 0% surcharge
  return 0;
}