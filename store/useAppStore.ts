// store/useAppStore.ts

import { create } from 'zustand';
import { ScenarioState, VisaSubclass } from '@/types/types';

// This is the default scenario that loads when the app first opens
const INITIAL_STATE: ScenarioState = {
  visaStatus: {
    applicant1: { visa: "491", isFirstHomeBuyer: true },
    isJointPurchase: false,
  },
  property: {
    landPrice: 350000,
    buildPrice: 320000,
    siteWorks: 20000,
    soilClassificationRisk: "Unknown",
    nathers7StarUpgrade: 12000,
  },
  expectedPRWaitMonths: 12,
  visaFailureRisk: false,
};

interface AppStore {
  current: ScenarioState;
  setAppState: (update: Partial<ScenarioState>) => void;
  resetState: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  current: INITIAL_STATE,
  
  // This function smartly merges new inputs with existing data
  setAppState: (update) => 
    set((state) => ({ current: { ...state.current, ...update } })),
    
  // A panic button to reset the calculator
  resetState: () => set({ current: INITIAL_STATE }),
}));