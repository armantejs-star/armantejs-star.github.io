import { create } from 'zustand';
import { ScenarioState } from '@/types/types';

// 1. The Default Baselines
const INITIAL_STATE: ScenarioState = {
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
  
  // Advanced Default Baselines
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
};

// 2. The Type Definitions for our State
interface AppStore {
  current: ScenarioState;
  isHelpDrawerOpen: boolean;
  isKnowledgeBaseOpen: boolean;
  setAppState: (update: Partial<ScenarioState>) => void;
  resetState: () => void;
  toggleHelpDrawer: () => void;
  setKnowledgeBaseOpen: (isOpen: boolean) => void;
}

// 3. The Actual Export that Next.js is looking for!
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