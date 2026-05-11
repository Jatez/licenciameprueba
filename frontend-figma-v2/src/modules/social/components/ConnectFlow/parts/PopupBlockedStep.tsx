import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { socialStrings } from "@/modules/social/strings";

interface PopupBlockedStepProps {
  onRetry: () => void;
  onClose: () => void;
}

export function PopupBlockedStep({ onRetry, onClose }: PopupBlockedStepProps) {
  const copy = socialStrings.connectFlow.popupBlocked;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
            <ShieldAlert size={24} className="text-foreground" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.body}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">{copy.instructionsTitle}</h3>
        <ul className="space-y-2 rounded-lg border border-border bg-surface p-3">
          {copy.instructions.map((line) => (
            <li key={line} className="text-sm text-foreground">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          {copy.close}
        </Button>
        <Button variant="default" onClick={onRetry}>
          {copy.retry}
        </Button>
      </DialogFooter>
    </>
  );
}
