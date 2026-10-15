// types/types.ts

export type VisaSubclass = "Citizen" | "PR" | "190" | "491" | "Foreign" | "Other";

export interface Applicant {
  visa: VisaSubclass;
  isFirstHomeBuyer: boolean;
}

export interface SpousalVisaStatus {
  applicant1: Applicant;
  applicant2?: Applicant; // Optional secondary applicant
  isJointPurchase: boolean;
}

export interface PropertyDetails {
  landPrice: number;
  buildPrice: number;
  siteWorks: number;
  soilClassificationRisk: "Low" | "Medium" | "High" | "Unknown";
  nathers7StarUpgrade: number;
}

export interface ScenarioState {
  visaStatus: SpousalVisaStatus;
  property: PropertyDetails;
  expectedPRWaitMonths: number;
  visaFailureRisk: boolean;
  
  // Income & Serviceability
  applicant1Income?: number;
  applicant2Income?: number; // Newly added
  monthlyDebts?: number;     // Newly added
  cashDeposit?: number;
  annualLivingExpenses?: number;

  // Advanced Build & Escalation
  preBuildDelayMonths?: number;
  builderEscalationPct?: number;
  contingencyPct?: number;
  postBuildSetup?: number;

  // Hidden Costs & Fees
  conveyancingFees?: number;
  overseasFxMarginPct?: number;

  // Holding Costs (Post-Handover)
  currentMonthlyRent?: number;
  councilRatesYearly?: number;
  insuranceYearly?: number;
  maintenanceMonthly?: number;

  // Strategy Engine Modifiers
  propertyGrowthPct?: number;
  etfReturnPct?: number;
}