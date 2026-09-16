// constants/soil.ts

export type SoilClass = "Low" | "Medium" | "High" | "Unknown";

// Estimated additional footing costs for Adelaide reactive clays
export const SOIL_CONTINGENCY_BUFFERS: Record<SoilClass, number> = {
  "Low": 0,          // Class A, S - Standard footings (usually included in base price)
  "Medium": 15000,   // Class M - Moderately reactive
  "High": 35000,     // Class H1, H2, E - Highly to extremely reactive
  "Unknown": 25000,  // Safe baseline buffer before soil tests return
};

export function getSoilBuffer(soilClass: SoilClass): number {
  return SOIL_CONTINGENCY_BUFFERS[soilClass] || 0;
}