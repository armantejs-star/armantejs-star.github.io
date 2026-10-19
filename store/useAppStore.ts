import { create } from 'zustand';
import { ScenarioState } from '@/types/types';

// We formally extend your existing dictionary with the new consulting features
export type AppState = ScenarioState & {
  clientName: string;
  isSaFhbEligible: boolean;
  buildDurationMonths: number;
  turnkeyAllowance: number;
};

const INITIAL_STATE: AppState = {
  visaStatus: {
    applicant1: { visa: "491", isFirstHomeBuyer: true },
    isJointPurchase: false,
  },
  property: {
    landPrice: 350000,
    buildPrice: 300000,
    siteWorks: 15000,
    soilClassificationRisk: "Unknown",
    nathers7StarUpgrade: 0,
  },
  expectedPRWaitMonths: 12,
  visaFailureRisk: false,
  
  applicant1Income: 80000,
  applicant2Income: 40000,
  monthlyDebts: 500,
  cashDeposit: 150000,
  
  preBuildDelayMonths: 0,
  builderEscalationPct: 6.0,
  contingencyPct: 10,
  postBuildSetup: 10000,
  
  conveyancingFees: 2500,
  overseasFxMarginPct: 1.5,
  
  currentMonthlyRent: 2200,
  councilRatesYearly: 3200,
  insuranceYearly: 1500,
  maintenanceMonthly: 100,
  
  propertyGrowthPct: 5.0,
  etfReturnPct: 7.0,

  // --- NEW CONSULTING FEATURES ---
  clientName: '',
  isSaFhbEligible: false,
  buildDurationMonths: 9,
  turnkeyAllowance: 15000,
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