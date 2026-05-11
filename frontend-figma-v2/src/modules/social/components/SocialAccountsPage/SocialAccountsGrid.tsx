import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SocialAccount, SocialPlatformF06 } from "@/api/types";
import { SocialAccountCard } from "../SocialAccountCard";
import type { AccountMenuAction } from "../SocialAccountCard/parts/SocialAccountCardActions";

interface SocialAccountsGridProps {
  accounts: SocialAccount[] | undefined;
  /** Pre-grouped by platform. Each entry is the representative card to show. */
  representatives?: SocialAccount[];
  countsByPlatform?: Record<SocialPlatformF06, number>;
  isLoading: boolean;
  onAction: (action: "connect" | "reconnect" | "retry" | "manage", accountId: string) => void;
  onMenu: (action: AccountMenuAction, accountId: string) => void;
}

export function SocialAccountsGrid({
  accounts,
  representatives,
  countsByPlatform,
  isLoading,
  onAction,
  onMenu,
}: SocialAccountsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </Card>
        ))}
      </div>
    );
  }

  const list = representatives ?? accounts ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {list.map((account) => (
        <SocialAccountCard
          key={account.id}
          account={account}
          platformCount={countsByPlatform?.[account.platform] ?? 1}
          onAction={onAction}
          onMenu={onMenu}
        />
      ))}
    </div>
  );
}
