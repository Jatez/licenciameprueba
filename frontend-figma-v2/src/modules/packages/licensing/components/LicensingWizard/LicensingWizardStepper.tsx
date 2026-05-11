import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";
import type { WizardStep } from "@/stores/licensingWizardStore";

interface Props {
  currentStep: WizardStep;
}

const STEPS: WizardStep[] = [1, 2, 3, 4];
const TOTAL = 4;

/**
 * Visual progress for the 4-step wizard. Compact on <640px (only active number),
 * full labels on larger viewports.
 */
export function LicensingWizardStepper({ currentStep }: Props) {
  const stepLabels = licensingStrings.wizard.steps;
  return (
    <div className="w-full">
      {/* Mobile compact */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            {formatString(licensingStrings.wizard.stepIndicator, {
              current: currentStep,
              total: TOTAL,
            })}
          </span>
          <span className="text-foreground">{stepLabels[currentStep]}</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(currentStep / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / tablet */}
      <ol
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-label={formatString(licensingStrings.wizard.aria, {
          current: currentStep,
          total: TOTAL,
        })}
        className="hidden items-center sm:flex"
      >
        {STEPS.map((step, idx) => {
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <li key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isDone &&
                      "border-primary bg-primary text-primary-foreground",
                    isActive &&
                      !isDone &&
                      "border-primary bg-primary text-primary-foreground",
                    !isActive &&
                      !isDone &&
                      "border-muted bg-background text-muted-foreground",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? <Check className="h-4 w-4" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive || isDone
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {stepLabels[step]}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors",
                    step < currentStep ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
