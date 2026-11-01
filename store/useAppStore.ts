import { create } from 'zustand';
import { ScenarioState } from '@/types/types';

export type AppState = ScenarioState & {
  clientName: string;
  isSaFhbEligible: boolean;
  buildDurationMonths: number;
  turnkeyAllowance: number;
  // LOAN PREFERENCES
  loanTermYears: number;
  repaymentType: 'PI' | 'IO';
  
  // --- NEW: PHASE 1 DUAL-ENGINE ARCHITECTURE ---
  activeView: 'build' | 'established' | 'compare';
  establishedProperty: {
    purchasePrice: number;
    strataYearly: number;
    renovationBuffer: number;
    settlementDays: number;
  };
};

const INITIAL_STATE: AppState = {
  visaStatus: {
    applicant1: { visa: "Citizen", isFirstHomeBuyer: false },
    isJointPurchase: false,
  },
  property: {
    landPrice: 0,
    buildPrice: 0,
    siteWorks: 0,
    soilClassificationRisk: "Unknown",
    nathers7StarUpgrade: 0,
  },
  expectedPRWaitMonths: 12,
  visaFailureRisk: false,
  
  applicant1Income: 0,
  applicant2Income: 0,
  monthlyDebts: 0,
  cashDeposit: 0,
  
  preBuildDelayMonths: 0,
  builderEscalationPct: 6.0,
  contingencyPct: 10,
  postBuildSetup: 0,
  
  conveyancingFees: 0,
  overseasFxMarginPct: 1.5,
  
  currentMonthlyRent: 0,
  councilRatesYearly: 0,
  insuranceYearly: 0,
  maintenanceMonthly: 0,
  
  propertyGrowthPct: 5.0,
  etfReturnPct: 7.0,

  clientName: '',
  isSaFhbEligible: false,
  buildDurationMonths: 9,
  turnkeyAllowance: 0,
  
  loanTermYears: 30,
  repaymentType: 'PI',

  // --- NEW DEFAULTS FOR ESTABLISHED MODE ---
  activeView: 'build', // Defaults to the current working mode
  establishedProperty: {
    purchasePrice: 0,
    strataYearly: 0,
    renovationBuffer: 0,
    settlementDays: 30,
  },
};

interface AppStore {
  current: AppState;
  isHelpDrawerOpen: boolean;
  isKnowledgeBaseOpen: boolean;
  setAppState: (update: Partial<AppState>) => void;
  resetState: () => void;
  toggleHelpDrawer: () => void;
  setKnowledgeBaseOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  current: INITIAL_STATE,
  isHelpDrawerOpen: false, 
  isKnowledgeBaseOpen: false,
  
  setAppState: (update) => 
    set((state) => ({ current: { ...state.current, ...update } })),
    
  resetState: () => set({ current: INITIAL_STATE }),
  
  toggleHelpDrawer: () => set((state) => ({ isHelpDrawerOpen: !state.isHelpDrawerOpen })),
  setKnowledgeBaseOpen: (isOpen) => set({ isKnowledgeBaseOpen: isOpen }),
}));