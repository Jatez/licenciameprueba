import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingStrings } from "../../strings";
import type { OnboardingTourStep } from "../types";

interface OnboardingTooltipCardProps {
  step: OnboardingTourStep;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

/**
 * Tooltip card rendered alongside the spotlight cutout. Self-contained: it owns
 * its own header (icon + step label), copy and footer controls.
 */
export function OnboardingTooltipCard({
  step,
  index,
  total,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
}: OnboardingTooltipCardProps) {
  const Icon = step.icon;
  const stepStrings =
    step.stringsKey && onboardingStrings.steps[step.stringsKey];
  const t = onboardingStrings.navigation;
  const stepLabel = t.stepLabel
    .replace("{current}", String(index + 1))
    .replace("{total}", String(total));

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={`onboarding-tooltip-${step.id}`}
      className="w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-ink-900">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {stepLabel}
            </p>
            {stepStrings && (
              <p className="truncate text-xs text-muted-foreground">
                {stepStrings.label}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onSkip}
          aria-label={t.close}
          className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-2 px-5 py-4">
        {stepStrings && (
          <>
            <h3
              id={`onboarding-tooltip-${step.id}`}
              className="text-base font-semibold tracking-tight text-foreground"
            >
              {stepStrings.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {stepStrings.description}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-4 rounded-full transition-colors ${
                i <= index ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isFirst && (
            <Button size="sm" variant="ghost" onClick={onPrev} className="gap-1.5 px-2">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t.previous}
            </Button>
          )}
          <Button size="sm" onClick={onNext} className="gap-1.5 whitespace-nowrap">
            {isLast ? t.finish : t.next}
            {!isLast && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
