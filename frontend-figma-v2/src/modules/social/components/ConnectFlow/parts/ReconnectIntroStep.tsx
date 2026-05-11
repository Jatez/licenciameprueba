import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlatformIcon } from "@/modules/monitoring/tracking/components/shared/PlatformIcon";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import type { SocialAccount } from "@/api/types";

interface ReconnectIntroStepProps {
  account: SocialAccount;
  onCancel: () => void;
  onContinue: () => void;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function formatExpiry(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function ReconnectIntroStep({
  account,
  onCancel,
  onContinue,
}: ReconnectIntroStepProps) {
  const platformLabel = trackingStrings.syncStatus.platformLabels[account.platform];
  const copy = socialStrings.connectFlow.reconnect;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lm-gray-100">
            <PlatformIcon platform={account.platform} size={28} aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle>{interpolate(copy.title, { platform: platformLabel })}</DialogTitle>
            <DialogDescription>
              {interpolate(copy.body, { date: formatExpiry(account.tokenExpiresAt) })}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <p className="text-sm text-muted-foreground rounded-md border border-border bg-surface p-3">
        {copy.keep}
      </p>

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel}>
          {copy.cancel}
        </Button>
        <Button variant="default" onClick={onContinue}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          {copy.cta}
        </Button>
      </DialogFooter>
    </>
  );
}
