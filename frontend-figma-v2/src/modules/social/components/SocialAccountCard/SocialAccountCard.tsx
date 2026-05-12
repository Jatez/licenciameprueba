import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/modules/monitoring/tracking/components/shared/PlatformIcon";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";
import type { SocialAccount } from "@/api/types";
import { socialStrings } from "@/modules/social/strings";
import {
  resolveAccountState,
  type AccountPrimaryAction,
  type AccountUIState,
} from "./SocialAccountCard.utils";
import { SocialAccountCardActions, type AccountMenuAction } from "./parts/SocialAccountCardActions";
import { HealthIndicator } from "./parts/HealthIndicator";
import { MultiAccountSummary } from "./parts/MultiAccountSummary";

interface SocialAccountCardProps {
  account: SocialAccount;
  /** Total accounts on the same platform (for multi-account summary). */
  platformCount?: number;
  onAction: (action: AccountPrimaryAction, accountId: string) => void;
  onMenu: (action: AccountMenuAction, accountId: string) => void;
}

const BADGE_VARIANT: Record<AccountUIState, "secondary" | "vigente" | "pendiente" | "expirada"> = {
  not_connected: "secondary",
  connected: "vigente",
  token_expired: "pendiente",
  error: "expirada",
  permissions_revoked: "expirada",
  duplicate_account: "expirada",
};

const PRIMARY_ACTION: Record<
  AccountUIState,
  "connect" | "manage" | "reconnect" | "retry" | "re_authorize" | "contact_support"
> = {
  not_connected: "connect",
  connected: "manage",
  token_expired: "reconnect",
  error: "retry",
  permissions_revoked: "re_authorize",
  duplicate_account: "contact_support",
};

function formatExpiryDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "d 'de' MMMM", { locale: es });
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function SocialAccountCard({
  account,
  platformCount = 1,
  onAction,
  onMenu,
}: SocialAccountCardProps) {
  const state = resolveAccountState(account);
  const platformLabel = trackingStrings.syncStatus.platformLabels[account.platform];

  return (
    <Card
      id={`card-${account.id}`}
      tabIndex={-1}
      className="flex h-full flex-col gap-4 p-5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-lm-gray-100 w-12 h-12 shrink-0">
            <PlatformIcon platform={account.platform} size={28} aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-foreground leading-none">{platformLabel}</h3>
            <Badge variant={BADGE_VARIANT[state]}>{socialStrings.card.statuses[state]}</Badge>
          </div>
        </div>
      </header>

      <div className="min-h-[64px] flex-1 text-sm">
        <CardBody account={account} state={state} platformCount={platformCount} />
      </div>

      <SocialAccountCardActions
        state={state}
        onPrimary={() => onAction(PRIMARY_ACTION[state], account.id)}
        onMenu={(action) => onMenu(action, account.id)}
      />
    </Card>
  );
}

interface CardBodyProps {
  account: SocialAccount;
  state: AccountUIState;
  platformCount: number;
}

function CardBody({ account, state, platformCount }: CardBodyProps) {
  const copy = socialStrings.card.body;

  if (state === "not_connected") {
    return <p className="text-muted-foreground">{copy.not_connected}</p>;
  }

  if (state === "error") {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground">{copy.error}</p>
        <HealthIndicator lastSyncAt={account.lastSyncAt} variant="error" />
      </div>
    );
  }

  if (state === "token_expired") {
    return (
      <div className="space-y-2">
        <p className="text-foreground">
          {interpolate(copy.tokenExpiredPrimary, {
            username: account.username || account.displayName,
            date: formatExpiryDate(account.tokenExpiresAt),
          })}
        </p>
        <p className="text-warning text-xs">{copy.tokenExpiredSecondary}</p>
      </div>
    );
  }

  if (state === "permissions_revoked") {
    const platformLabel = trackingStrings.syncStatus.platformLabels[account.platform];
    return (
      <div className="space-y-2">
        <p className="text-foreground">
          {interpolate(copy.permissionsRevokedPrimary, {
            username: account.username || account.displayName,
            platform: platformLabel,
          })}
        </p>
        <p className="text-destructive text-xs">{copy.permissionsRevokedSecondary}</p>
      </div>
    );
  }

  if (state === "duplicate_account") {
    return (
      <div className="space-y-2">
        <p className="text-foreground">
          {interpolate(copy.duplicateAccountPrimary, {
            username: account.username || account.displayName,
          })}
        </p>
        <p className="text-muted-foreground text-xs">{copy.duplicateAccountSecondary}</p>
      </div>
    );
  }

  // connected
  const username = account.username || account.displayName;
  const connectedDuration = formatRelativeFromNow(account.connectedAt);
  const lastSync = formatRelativeFromNow(account.lastSyncAt);
  const extra = Math.max(0, platformCount - 1);

  return (
    <div className="space-y-2">
      {extra > 0 ? (
        <MultiAccountSummary primaryUsername={username} extraCount={extra} />
      ) : (
        <p className="text-foreground">
          {interpolate(copy.connectedPrimary, { username, duration: connectedDuration })}
        </p>
      )}
      <p className="text-muted-foreground text-xs">
        {interpolate(copy.connectedSecondary, { duration: lastSync })}
      </p>
      <HealthIndicator lastSyncAt={account.lastSyncAt} variant="ok" />
    </div>
  );
}
