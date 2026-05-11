import type { LucideIcon } from "lucide-react";

export type OnboardingTourStepId =
  | "welcome"
  | "explore-catalog"
  | "buy-credits"
  | "connect-social";

export interface OnboardingTourStep {
  id: OnboardingTourStepId;
  /** 1..4 — used for stepper UI. */
  order: number;
  /** "modal": centered welcome card. "spotlight": tooltip anchored to a target. */
  kind: "modal" | "spotlight";
  /** CSS selector to match `data-tour-target="..."` on the page. */
  targetSelector?: string;
  /** Fallback selector if the primary target is not on screen (e.g. on a different route). */
  fallbackSelector?: string;
  /** Route the tour navigates to before showing this step (so the target exists). */
  navigateTo?: string;
  /** Tooltip placement relative to the spotlight target. */
  placement?: "top" | "bottom" | "left" | "right";
  icon: LucideIcon;
  /** Key under onboardingStrings.steps. */
  stringsKey?: Exclude<OnboardingTourStepId, "welcome">;
}
