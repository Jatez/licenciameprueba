import { useEffect, useState } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import type { SocialPlatformF06 } from "@/api/types";
import type { MockConnectionResult } from "../ConnectFlow.types";

interface SuccessStepProps {
  platform: SocialPlatformF06;
  result: MockConnectionResult;
  onDone: () => void;
}

const SYNC_DURATION_MS = 3500;
const SYNC_TICK_MS = 100;

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function SuccessStep({ platform, result, onDone }: SuccessStepProps) {
  const platformLabel = trackingStrings.syncStatus.platformLabels[platform];
  const copy = socialStrings.connectFlow.success;

  const [progress, setProgress] = useState(0);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / SYNC_DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setSyncDone(true);
      }
    }, SYNC_TICK_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DialogHeader className="items-center text-center sm:text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary animate-in zoom-in-95"
          aria-hidden="true"
        >
          <Check size={36} className="text-primary-foreground" strokeWidth={3} />
        </div>
        <DialogTitle className="text-center">
          {interpolate(copy.title, { platform: platformLabel })}
        </DialogTitle>
        <DialogDescription className="text-center">
          {interpolate(copy.subtitleTemplate, {
            username: result.username,
            displayName: result.displayName,
          })}
        </DialogDescription>
      </DialogHeader>

      <div
        className="rounded-lg border border-border bg-surface p-4 space-y-3"
        role="status"
        aria-live="polite"
      >
        {syncDone ? (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 size={20} className="text-success shrink-0" aria-hidden="true" />
            <span>
              {interpolate(copy.syncDone, { count: String(result.postsFound) })}
            </span>
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground">{copy.syncing}</p>
            <Progress value={progress} className="h-2" />
          </>
        )}
      </div>

      <DialogFooter>
        <Button variant="default" onClick={onDone} disabled={!syncDone} className="w-full sm:w-auto">
          {copy.done}
        </Button>
      </DialogFooter>
    </>
  );
}
