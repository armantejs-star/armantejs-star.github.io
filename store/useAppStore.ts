// store/useAppStore.ts

import { create } from 'zustand';
import { ScenarioState } from '@/types/types';

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

// We added 'isHelpDrawerOpen' and 'toggleHelpDrawer' here
interface AppStore {
  current: ScenarioState;
  isHelpDrawerOpen: boolean;
  setAppState: (update: Partial<ScenarioState>) => void;
  resetState: () => void;
  toggleHelpDrawer: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  current: INITIAL_STATE,
  isHelpDrawerOpen: false, // The drawer starts closed
  
  setAppState: (update) => 
    set((state) => ({ current: { ...state.current, ...update } })),
    
  resetState: () => set({ current: INITIAL_STATE }),
  
  // This flips the drawer open or closed
  toggleHelpDrawer: () => set((state) => ({ isHelpDrawerOpen: !state.isHelpDrawerOpen })),
}));