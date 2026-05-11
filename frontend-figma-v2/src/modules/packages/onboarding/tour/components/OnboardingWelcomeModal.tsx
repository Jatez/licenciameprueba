import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/shared/components/ds/ResponsiveDialog";
import { onboardingStrings } from "../../strings";

interface OnboardingWelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

/**
 * Centered welcome card (step 1 of 4). Acts as a modal dialog.
 * Uses tokens from the design system — no hardcoded colors.
 */
export function OnboardingWelcomeModal({ onStart, onSkip }: OnboardingWelcomeModalProps) {
  const t = onboardingStrings.welcome;
  return (
    <ResponsiveDialog
      open
      onOpenChange={(o) => !o && onSkip()}
      title={t.title}
      description={t.subtitle}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onSkip} className="sm:min-w-32">
            {t.skip}
          </Button>
          <Button onClick={onStart} className="w-full sm:w-auto sm:min-w-32">
            {t.cta}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-ink-900">
          <Sparkles className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
          {t.durationHint}
        </p>
      </div>
    </ResponsiveDialog>
  );
}
