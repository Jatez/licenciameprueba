import { Music, Sparkles, CreditCard, Share2 } from "lucide-react";
import type { OnboardingTourStep } from "../types";

/** Stable identifiers exposed by the sidebar / pages via data-tour-target. */
export const TOUR_TARGETS = {
  catalog: "nav-catalog",
  packages: "nav-packages",
  social: "nav-social",
} as const;

export const ONBOARDING_TOUR_STEPS: ReadonlyArray<OnboardingTourStep> = [
  {
    id: "welcome",
    order: 1,
    kind: "modal",
    icon: Sparkles,
  },
  {
    id: "explore-catalog",
    order: 2,
    kind: "spotlight",
    targetSelector: `[data-tour-target="${TOUR_TARGETS.catalog}"]`,
    navigateTo: "/catalog",
    placement: "right",
    icon: Music,
    stringsKey: "explore-catalog",
  },
  {
    id: "buy-credits",
    order: 3,
    kind: "spotlight",
    targetSelector: `[data-tour-target="${TOUR_TARGETS.packages}"]`,
    navigateTo: "/packages",
    placement: "right",
    icon: CreditCard,
    stringsKey: "buy-credits",
  },
  {
    id: "connect-social",
    order: 4,
    kind: "spotlight",
    targetSelector: `[data-tour-target="${TOUR_TARGETS.social}"]`,
    navigateTo: "/social",
    placement: "right",
    icon: Share2,
    stringsKey: "connect-social",
  },
];

export const TOUR_TOTAL_STEPS = ONBOARDING_TOUR_STEPS.length;
