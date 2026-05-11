import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import {
  useDisconnectSocialAccount,
  useSetPrimaryAccount,
} from "@/modules/social/hooks";
import type { SocialAccount } from "@/api/types";
import { avatarInitial } from "./ManageAccounts.utils";

interface ManageAccountRowProps {
  account: SocialAccount;
  isOnlyAccount: boolean;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function ManageAccountRow({ account, isOnlyAccount }: ManageAccountRowProps) {
  const copy = socialStrings.manage;
  const platformLabel = trackingStrings.syncStatus.platformLabels[account.platform];
  const setPrimary = useSetPrimaryAccount();
  const disconnect = useDisconnectSocialAccount();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const username = account.username || account.displayName;
  const switchId = `primary-${account.id}`;

  const handleSetPrimary = (next: boolean) => {
    if (!next || account.isPrimary) return;
    setPrimary.mutate(account.id, {
      onSuccess: () =>
        toast.success(
          interpolate(copy.toastPrimary, { username, platform: platformLabel }),
        ),
    });
  };

  const handleDisconnect = () => {
    disconnect.mutate(account.id, {
      onSuccess: () => {
        toast.success(interpolate(copy.toastDisconnected, { username }));
        setConfirmOpen(false);
      },
    });
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lm-gray-100 text-sm font-semibold text-foreground"
          aria-hidden="true"
        >
          {avatarInitial(account)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{username}</p>
          <p className="text-xs text-muted-foreground">
            {interpolate(copy.connectedAt, {
              duration: formatRelativeFromNow(account.connectedAt),
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {interpolate(copy.lastSync, {
              duration: formatRelativeFromNow(account.lastSyncAt),
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Switch
            id={switchId}
            checked={!!account.isPrimary}
            onCheckedChange={handleSetPrimary}
            disabled={account.isPrimary || setPrimary.isPending}
            aria-describedby={`${switchId}-hint`}
          />
          <div className="flex flex-col">
            <Label htmlFor={switchId} className="cursor-pointer text-xs font-medium">
              {copy.primaryLabel}
            </Label>
            <span id={`${switchId}-hint`} className="text-[10px] text-muted-foreground">
              {copy.primaryHint}
            </span>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setConfirmOpen(true)}
          disabled={isOnlyAccount && account.isPrimary && false /* allow always */}
        >
          {copy.disconnect}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {interpolate(copy.disconnectConfirmTitle, { username })}
            </AlertDialogTitle>
            <AlertDialogDescription>{copy.disconnectConfirmBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.disconnectConfirmCancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={disconnect.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {copy.disconnectConfirmCta}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
