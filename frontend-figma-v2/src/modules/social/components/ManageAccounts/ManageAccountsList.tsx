import { Skeleton } from "@/components/ui/skeleton";
import { socialStrings } from "@/modules/social/strings";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import type { SocialAccount, SocialPlatformF06 } from "@/api/types";
import { ManageAccountRow } from "./ManageAccountRow";

interface ManageAccountsListProps {
  platform: SocialPlatformF06;
  accounts: SocialAccount[];
  isLoading: boolean;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function ManageAccountsList({
  platform,
  accounts,
  isLoading,
}: ManageAccountsListProps) {
  const platformLabel = trackingStrings.syncStatus.platformLabels[platform];

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {interpolate(socialStrings.manage.empty, { platform: platformLabel })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <ManageAccountRow
          key={account.id}
          account={account}
          isOnlyAccount={accounts.length === 1}
        />
      ))}
    </div>
  );
}
