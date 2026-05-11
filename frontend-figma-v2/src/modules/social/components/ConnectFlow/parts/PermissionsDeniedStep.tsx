import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import type { SocialPlatformF06 } from "@/api/types";

interface PermissionsDeniedStepProps {
  platform: SocialPlatformF06;
  onRetry: () => void;
  onDismiss: () => void;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function PermissionsDeniedStep({
  platform,
  onRetry,
  onDismiss,
}: PermissionsDeniedStepProps) {
  const platformLabel = trackingStrings.syncStatus.platformLabels[platform];
  const copy = socialStrings.connectFlow.permissionsDenied;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10">
            <AlertTriangle size={24} className="text-warning" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle>{interpolate(copy.title, { platform: platformLabel })}</DialogTitle>
            <DialogDescription>
              {interpolate(copy.body, { platform: platformLabel })}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">{copy.lossesTitle}</h3>
        <ul className="space-y-2">
          {copy.losses.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-foreground">
              <X
                size={18}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground mt-0.5"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <DialogFooter>
        <Button variant="ghost" onClick={onDismiss}>
          {copy.dismiss}
        </Button>
        <Button variant="default" onClick={onRetry}>
          {copy.retry}
        </Button>
      </DialogFooter>
    </>
  );
}
