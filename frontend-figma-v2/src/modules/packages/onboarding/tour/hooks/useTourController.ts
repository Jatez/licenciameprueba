import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOnboardingTourStore } from "../store/onboardingTourStore";
import { ONBOARDING_TOUR_STEPS, TOUR_TOTAL_STEPS } from "../config/steps";
import type { OnboardingTourStep } from "../types";

interface TourController {
  step: OnboardingTourStep;
  index: number; // 0-based
  total: number;
  isFirst: boolean;
  isLast: boolean;
  status: ReturnType<typeof useOnboardingTourStore.getState>["status"];
  next: () => void;
  prev: () => void;
  skip: () => void;
  complete: () => void;
  restart: () => void;
}

/**
 * Centralized controller for the tour: selects the active step config,
 * navigates to the matching route when needed, and exposes lifecycle actions.
 */
export function useTourController(): TourController {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const status = useOnboardingTourStore((s) => s.status);
  const currentStep = useOnboardingTourStore((s) => s.currentStep);
  const next = useOnboardingTourStore((s) => s.next);
  const prev = useOnboardingTourStore((s) => s.prev);
  const skip = useOnboardingTourStore((s) => s.skip);
  const complete = useOnboardingTourStore((s) => s.complete);
  const restart = useOnboardingTourStore((s) => s.restart);

  const step = ONBOARDING_TOUR_STEPS[currentStep - 1] ?? ONBOARDING_TOUR_STEPS[0];

  // Auto-navigate to the step's route so the spotlight target is mounted.
  useEffect(() => {
    if (status !== "running") return;
    if (!step.navigateTo) return;
    if (pathname === step.navigateTo) return;
    navigate(step.navigateTo);
  }, [status, step, pathname, navigate]);

  return useMemo(
    () => ({
      step,
      index: currentStep - 1,
      total: TOUR_TOTAL_STEPS,
      isFirst: currentStep === 1,
      isLast: currentStep === TOUR_TOTAL_STEPS,
      status,
      next,
      prev,
      skip,
      complete,
      restart,
    }),
    [step, currentStep, status, next, prev, skip, complete, restart],
  );
}
