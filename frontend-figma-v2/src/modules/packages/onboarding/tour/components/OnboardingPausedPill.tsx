import { Sparkles } from "lucide-react";
import { onboardingStrings } from "../../strings";

interface OnboardingPausedPillProps {
  onResume: () => void;
}

/** Bottom-right floating pill shown while the tour is paused. */
export function OnboardingPausedPill({ onResume }: OnboardingPausedPillProps) {
  const t = onboardingStrings.paused;
  return (
    <button
      type="button"
      onClick={onResume}
      className="fixed bottom-6 right-6 z-[90] inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t.resume}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-ink-900">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-xs font-semibold">{t.title}</span>
        <span className="text-[11px] text-muted-foreground">{t.resume}</span>
      </span>
    </button>
  );
}
