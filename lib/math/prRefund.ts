// lib/math/prRefund.ts

/**
 * Calculates the potential RevenueSA 12-month PR refund.
 * If a temporary resident gets their PR granted within 12 months 
 * after settlement, they can claim the 7% surcharge back.
 */
export function calculatePrRefundPotential(
  surchargePaid: number, 
  expectedWaitMonths: number
): number {
  if (surchargePaid <= 0) return 0;

  // RevenueSA refund eligibility window
  if (expectedWaitMonths <= 12) {
    return surchargePaid; 
  }
  
  // If PR is expected after 12 months, the money is gone permanently
  return 0; 
}