import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { packagesStrings } from "@/modules/packages/packages/strings";
import type { CheckoutStep } from "./checkoutDraft.types";

interface CheckoutWizardStepperProps {
  current: CheckoutStep;
}

export function CheckoutWizardStepper({ current }: CheckoutWizardStepperProps) {
  const labels = packagesStrings.checkout.stepper;
  const steps: { n: CheckoutStep; label: string }[] = [
    { n: 1, label: labels.step1 },
    { n: 2, label: labels.step2 },
    { n: 3, label: labels.step3 },
    { n: 4, label: labels.step4 },
    { n: 5, label: labels.step5 },
  ];

  return (
    <ol
      aria-label={labels.aria}
      className="flex w-full items-center gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-2 sm:gap-2"
    >
      {steps.map((s, idx) => {
        const isDone = current > s.n;
        const isActive = current === s.n;
        return (
          <li
            key={s.n}
            aria-current={isActive ? "step" : undefined}
            aria-label={`${labels.aria}: ${s.n}. ${s.label}`}
            className="flex flex-1 items-center gap-2 min-w-0"
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                isActive && "bg-primary text-primary-foreground",
                isDone && "bg-foreground text-background",
                !isActive && !isDone && "bg-muted text-muted-foreground",
              )}
              aria-hidden="true"
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : s.n}
            </span>
            <span
              className={cn(
                "truncate text-xs font-medium sm:text-sm",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "hidden h-px flex-1 sm:block",
                  isDone ? "bg-foreground" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
