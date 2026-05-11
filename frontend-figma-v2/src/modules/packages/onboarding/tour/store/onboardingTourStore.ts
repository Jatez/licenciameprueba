import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOUR_TOTAL_STEPS } from "../config/steps";

export type TourStatus = "idle" | "running" | "paused" | "completed" | "skipped";

interface OnboardingTourState {
  /** Lifecycle of the tour. */
  status: TourStatus;
  /** 1..TOUR_TOTAL_STEPS. */
  currentStep: number;
  /** True after the tour has been auto-launched at least once for this user. */
  hasAutoLaunched: boolean;

  start: () => void;
  next: () => void;
  prev: () => void;
  goTo: (step: number) => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  complete: () => void;
  /** Restart from welcome — used by the "Volver a ver el tour" CTA. */
  restart: () => void;
  /** Marks the tour as having auto-launched (to avoid re-opening on every reload). */
  markAutoLaunched: () => void;
}

const clamp = (n: number) => Math.max(1, Math.min(TOUR_TOTAL_STEPS, n));

/**
 * UI-only state for the in-app product tour.
 * Persisted to localStorage so we don't replay it on every visit.
 */
export const useOnboardingTourStore = create<OnboardingTourState>()(
  persist(
    (set, get) => ({
      status: "idle",
      currentStep: 1,
      hasAutoLaunched: false,

      start: () => set({ status: "running", currentStep: 1 }),
      next: () => {
        const next = get().currentStep + 1;
        if (next > TOUR_TOTAL_STEPS) {
          set({ status: "completed", currentStep: TOUR_TOTAL_STEPS });
          return;
        }
        set({ currentStep: clamp(next) });
      },
      prev: () => set({ currentStep: clamp(get().currentStep - 1) }),
      goTo: (step) => set({ currentStep: clamp(step) }),
      pause: () => {
        if (get().status === "running") set({ status: "paused" });
      },
      resume: () => set({ status: "running" }),
      skip: () => set({ status: "skipped" }),
      complete: () => set({ status: "completed", currentStep: TOUR_TOTAL_STEPS }),
      restart: () =>
        set({
          status: "running",
          currentStep: 1,
          hasAutoLaunched: true,
        }),
      markAutoLaunched: () => set({ hasAutoLaunched: true }),
    }),
    {
      name: "licenciame:onboarding-tour:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        status: s.status,
        currentStep: s.currentStep,
        hasAutoLaunched: s.hasAutoLaunched,
      }),
    },
  ),
);
