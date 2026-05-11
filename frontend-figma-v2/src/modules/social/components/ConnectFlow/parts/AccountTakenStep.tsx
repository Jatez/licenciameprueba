import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { socialStrings } from "@/modules/social/strings";

interface AccountTakenStepProps {
  attemptedUsername: string;
  onClose: () => void;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function AccountTakenStep({ attemptedUsername, onClose }: AccountTakenStepProps) {
  const copy = socialStrings.connectFlow.accountTaken;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10">
            <UserX size={24} className="text-warning" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>
              {interpolate(copy.body, { username: attemptedUsername })}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <ul className="space-y-2">
        {copy.hints.map((hint) => (
          <li
            key={hint}
            className="text-sm text-foreground rounded-md border border-border bg-surface p-3"
          >
            {hint}
          </li>
        ))}
      </ul>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          {copy.close}
        </Button>
        <Button variant="default" asChild>
          <a href={copy.mailto}>{copy.contact}</a>
        </Button>
      </DialogFooter>
    </>
  );
}
