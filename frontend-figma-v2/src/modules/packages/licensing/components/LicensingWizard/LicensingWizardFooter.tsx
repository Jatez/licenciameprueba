import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  canGoPrev: boolean;
  canGoNext: boolean;
  nextDisabledReason: string | null;
  showNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Optional override for the next button label (e.g. "Confirmar"). */
  nextLabel?: string;
}

export function LicensingWizardFooter({
  canGoPrev,
  canGoNext,
  nextDisabledReason,
  showNext,
  onPrev,
  onNext,
  nextLabel,
}: Props) {
  const nextButton = (
    <Button
      onClick={onNext}
      disabled={!canGoNext}
      size="lg"
      className="min-w-32"
    >
      {nextLabel ?? licensingStrings.wizard.next}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        onClick={onPrev}
        disabled={!canGoPrev}
        size="lg"
      >
        <ArrowLeft className="h-4 w-4" />
        {licensingStrings.wizard.previous}
      </Button>

      {showNext &&
        (!canGoNext && nextDisabledReason ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>{nextButton}</span>
              </TooltipTrigger>
              <TooltipContent>{nextDisabledReason}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          nextButton
        ))}
    </div>
  );
}
