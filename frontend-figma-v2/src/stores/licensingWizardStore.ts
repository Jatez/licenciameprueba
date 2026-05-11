import { create } from "zustand";
import type { LicenseUsageType, License } from "@/api/types";

export type WizardStep = 1 | 2 | 3 | 4;

interface LicensingWizardState {
  currentStep: WizardStep;
  trackId: string | null;
  selectedUsageType: LicenseUsageType | null;
  acceptedTermsVersion: string | null;
  acceptedAt: string | null;
  issuedLicense: License | null;

  setTrackId: (id: string) => void;
  setUsageType: (type: LicenseUsageType) => void;
  acceptTerms: (version: string) => void;
  setIssuedLicense: (license: License) => void;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const clampStep = (n: number): WizardStep => {
  if (n < 1) return 1;
  if (n > 4) return 4;
  return n as WizardStep;
};

/**
 * Ephemeral wizard state. Never persisted: a hard reload sends the user back
 * to step 1 with `trackId` re-hydrated from the URL.
 */
export const useLicensingWizardStore = create<LicensingWizardState>((set, get) => ({
  currentStep: 1,
  trackId: null,
  selectedUsageType: null,
  acceptedTermsVersion: null,
  acceptedAt: null,
  issuedLicense: null,

  setTrackId: (id) => set({ trackId: id }),
  setUsageType: (type) => set({ selectedUsageType: type }),

  acceptTerms: (version) => {
    if (get().currentStep !== 3) {
      console.warn("[licensingWizardStore] acceptTerms called outside step 3");
      return;
    }
    set({ acceptedTermsVersion: version, acceptedAt: new Date().toISOString() });
  },

  setIssuedLicense: (license) => {
    if (get().currentStep !== 3 && get().currentStep !== 4) {
      console.warn("[licensingWizardStore] setIssuedLicense called outside step 3/4");
      return;
    }
    set({ issuedLicense: license, currentStep: 4 });
  },

  goToStep: (step) => set({ currentStep: clampStep(step) }),
  nextStep: () => set({ currentStep: clampStep(get().currentStep + 1) }),
  prevStep: () => set({ currentStep: clampStep(get().currentStep - 1) }),

  reset: () =>
    set({
      currentStep: 1,
      trackId: null,
      selectedUsageType: null,
      acceptedTermsVersion: null,
      acceptedAt: null,
      issuedLicense: null,
    }),
}));
