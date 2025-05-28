// src/store/onboardingStore.ts
import { create } from 'zustand';

// Interfaces για το store
interface UserData {
  gender?: string;
  ageGroup?: string;
  stylePreferences?: string[];
  // Μπορείς να προσθέσεις κι άλλα πεδία εδώ για μελλοντικά βήματα
}

interface OnboardingState {
  currentStep: number;
  userData: UserData;
  setCurrentStep: (step: number) => void;
  setUserData: (data: Partial<UserData>) => void; // Partial επιτρέπει την ενημέρωση μέρους του userData
  resetOnboarding: () => void;
}

const initialState: Pick<OnboardingState, 'currentStep' | 'userData'> = {
  currentStep: 1,
  userData: {
    gender: undefined,
    ageGroup: undefined,
    stylePreferences: [],
  },
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  setUserData: (data) => set((state) => ({
    userData: { ...state.userData, ...data }
  })),
  resetOnboarding: () => set(initialState),
}));