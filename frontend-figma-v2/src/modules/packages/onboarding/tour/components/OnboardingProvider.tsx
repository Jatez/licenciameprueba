import { useEffect } from "react";
import { toast } from "sonner";
import { useOnboardingTourStore } from "../store/onboardingTourStore";
import { useTourController } from "../hooks/useTourController";
import { onboardingStrings } from "../../strings";
import { OnboardingWelcomeModal } from "./OnboardingWelcomeModal";
import { OnboardingSpotlight } from "./OnboardingSpotlight";
import { OnboardingPausedPill } from "./OnboardingPausedPill";

/**
 * Top-level orchestrator for the in-app product tour.
 * Mount once inside the authenticated app shell (AppLayout).
 */
export function OnboardingProvider() {
  const status = useOnboardingTourStore((s) => s.status);
  const hasAutoLaunched = useOnboardingTourStore((s) => s.hasAutoLaunched);
  const start = useOnboardingTourStore((s) => s.start);
  const markAutoLaunched = useOnboardingTourStore((s) => s.markAutoLaunched);
  const resume = useOnboardingTourStore((s) => s.resume);

  const controller = useTourController();
  const { step, index, total, isFirst, isLast, next, prev, skip, complete } =
    controller;

  // Auto-launch the tour on first ever visit for this device.
  useEffect(() => {
    if (hasAutoLaunched) return;
    if (status === "idle") {
      start();
      markAutoLaunched();
    }
  }, [hasAutoLaunched, status, start, markAutoLaunched]);

  // ESC pauses (so users can click around without losing progress).
  useEffect(() => {
    if (status !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useOnboardingTourStore.getState().pause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  // Toast on completion (one-shot).
  useEffect(() => {
    if (status === "completed") {
      toast.success(onboardingStrings.completion.title, {
        description: onboardingStrings.completion.description,
      });
    }
  }, [status]);

  if (status !== "running" && status !== "paused") return null;

  if (status === "paused") {
    return <OnboardingPausedPill onResume={resume} />;
  }

  // Step 1 → welcome modal. Steps 2..4 → spotlight overlay.
  if (step.kind === "modal") {
    return (
      <OnboardingWelcomeModal
        onStart={next}
        onSkip={skip}
      />
    );
  }

  return (
    <OnboardingSpotlight
      step={step}
      index={index}
      total={total}
      isFirst={isFirst}
      isLast={isLast}
      onNext={() => {
        if (isLast) complete();
        else next();
      }}
      onPrev={prev}
      onSkip={skip}
    />
  );
}
