import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { useSocialAccounts } from "@/modules/social/hooks";
import { useSocialDebugStore } from "@/modules/social/stores/socialDebugStore";
import { socialStrings } from "@/modules/social/strings";
import type { SocialAccount, SocialPlatformF06 } from "@/api/types";
import { countConnected, resolveAccountState } from "../SocialAccountCard/SocialAccountCard.utils";
import type { AccountMenuAction } from "../SocialAccountCard/parts/SocialAccountCardActions";
import { ConnectFlowDialog } from "../ConnectFlow";
import { ManageAccountsDrawer } from "../ManageAccounts";
import { DebugPanel } from "../DebugPanel";
import { SocialAccountsHeader } from "./SocialAccountsHeader";
import { SocialContextCard } from "./SocialContextCard";
import { SocialAccountsGrid } from "./SocialAccountsGrid";
import { WhyConnectAccordion } from "./WhyConnectAccordion";
import { ConnectionsAlertBanner } from "./ConnectionsAlertBanner";

interface FlowConfig {
  platform: SocialPlatformF06;
  mode: "connect" | "reconnect";
  existingAccount: SocialAccount | null;
}

export function SocialAccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const includeErrorDemo = searchParams.get("demo") === "error";
  const {
    forceInstagramExpired,
    simulatePermissionsRevoked,
    simulateDuplicateAccount,
  } = useSocialDebugStore();

  const { data, isLoading, isError, refetch, isFetching } = useSocialAccounts({
    includeErrorDemo,
    forceInstagramExpired,
    simulatePermissionsRevoked,
    simulateDuplicateAccount,
  });

  // Handle OAuth callback params from backend redirect (?meta=connected, ?tiktok=connected, etc.)
  useEffect(() => {
    const meta = searchParams.get("meta");
    const tiktok = searchParams.get("tiktok");

    if (meta === "connected") {
      toast.success("Instagram conectado correctamente ✓");
      void refetch();
      setSearchParams({}, { replace: true });
    } else if (meta === "fb-connected") {
      toast.success("Facebook conectado correctamente ✓");
      void refetch();
      setSearchParams({}, { replace: true });
    } else if (tiktok === "connected") {
      toast.success("TikTok conectado correctamente ✓");
      void refetch();
      setSearchParams({}, { replace: true });
    } else if (tiktok === "error") {
      toast.error("No pudimos conectar TikTok. Intenta de nuevo.");
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Health-check toast: fire once after first successful load.
  const healthToastFired = useRef(false);
  useEffect(() => {
    if (healthToastFired.current) return;
    if (isLoading || !data) return;
    healthToastFired.current = true;
    const timer = setTimeout(() => {
      toast.success(socialStrings.health.toastDone);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isLoading, data]);

  const [flow, setFlow] = useState<FlowConfig | null>(null);
  const [manageFor, setManageFor] = useState<SocialPlatformF06 | null>(null);

  const findAccount = (id: string): SocialAccount | undefined => {
    // Check real accounts first, then fallback to platform placeholders.
    const real = data?.find((a) => a.id === id);
    if (real) return real;
    if (id.startsWith("placeholder-")) {
      const platform = id.replace("placeholder-", "") as SocialPlatformF06;
      return makePlaceholder(platform);
    }
    return undefined;
  };

  // Group accounts: one representative per platform (primary > first connected > first).
  // Platforms with no account get a placeholder card in "not_connected" state.
  const PLATFORMS: SocialPlatformF06[] = ["instagram", "tiktok", "facebook"];

  function makePlaceholder(platform: SocialPlatformF06): SocialAccount {
    return {
      id: `placeholder-${platform}`,
      platform,
      username: "",
      displayName: "",
      avatarUrl: null,
      connected: false,
      connectedAt: new Date().toISOString(),
      tokenExpiresAt: null,
      syncStatus: "disconnected",
      lastSyncAt: new Date().toISOString(),
      isPrimary: false,
    };
  }

  const { representatives, countsByPlatform } = useMemo(() => {
    const counts: Record<SocialPlatformF06, number> = {
      instagram: 0,
      tiktok: 0,
      facebook: 0,
    };
    const reps: Record<SocialPlatformF06, SocialAccount | undefined> = {
      instagram: undefined,
      tiktok: undefined,
      facebook: undefined,
    };
    (data ?? []).forEach((acc) => {
      if (acc.connected) counts[acc.platform] += 1;
      const current = reps[acc.platform];
      if (!current) {
        reps[acc.platform] = acc;
        return;
      }
      // Prefer primary, then connected, then leave the first.
      if (acc.isPrimary && !current.isPrimary) reps[acc.platform] = acc;
      else if (acc.connected && !current.connected) reps[acc.platform] = acc;
    });
    // Fill missing platforms with placeholders so all 3 cards are always visible.
    PLATFORMS.forEach((p) => {
      if (!reps[p]) reps[p] = makePlaceholder(p);
    });
    return {
      representatives: PLATFORMS.map((p) => reps[p]!),
      countsByPlatform: counts,
    };
  }, [data]);

  const handleAction = (
    action:
      | "connect"
      | "reconnect"
      | "retry"
      | "manage"
      | "re_authorize"
      | "contact_support",
    accountId: string,
  ) => {
    const account = findAccount(accountId);
    if (!account) return;

    if (action === "connect") {
      setFlow({ platform: account.platform, mode: "connect", existingAccount: null });
      return;
    }
    if (action === "reconnect" || action === "re_authorize") {
      setFlow({ platform: account.platform, mode: "reconnect", existingAccount: account });
      return;
    }
    if (action === "manage") {
      setManageFor(account.platform);
      return;
    }
    if (action === "retry") {
      setFlow({ platform: account.platform, mode: "connect", existingAccount: null });
      return;
    }
    if (action === "contact_support") {
      window.location.href = socialStrings.card.supportMailto;
    }
  };

  const handleMenu = (action: AccountMenuAction, accountId: string) => {
    const account = findAccount(accountId);
    if (!account) return;
    if (action === "view_details" || action === "disconnect") {
      setManageFor(account.platform);
      return;
    }
    if (action === "sync_now") {
      void refetch();
    }
  };

  const total = data?.length ?? 3;
  const connected = data ? countConnected(data) : 0;
  const hasIssues = (data ?? []).some((a) => {
    const s = resolveAccountState(a);
    return s === "token_expired" || s === "error";
  });

  return (
    <div className="w-full space-y-5">
      <AppPageHeader
        title={socialStrings.header.title}
        description={socialStrings.header.subtitle}
        liftStickyDesktop
      />
      <SocialAccountsHeader
        connected={connected}
        total={total}
        isLoading={isLoading}
        compact
      />

      <SocialContextCard />

      {hasIssues && <ConnectionsAlertBanner accounts={data} />}

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>{socialStrings.loadingError.title}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{socialStrings.loadingError.description}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {socialStrings.loadingError.retry}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <section aria-labelledby="social-accounts-heading">
          <h2 id="social-accounts-heading" className="sr-only">
            {socialStrings.header.title}
          </h2>
          <SocialAccountsGrid
            accounts={data}
            representatives={representatives}
            countsByPlatform={countsByPlatform}
            isLoading={isLoading}
            onAction={handleAction}
            onMenu={handleMenu}
          />
        </section>
      )}

      <section aria-labelledby="why-connect-heading">
        <h2 id="why-connect-heading" className="sr-only">
          {socialStrings.whyConnect.title}
        </h2>
        <WhyConnectAccordion />
      </section>

      <ConnectFlowDialog
        platform={flow?.platform ?? null}
        mode={flow?.mode}
        existingAccount={flow?.existingAccount ?? null}
        onClose={() => setFlow(null)}
      />

      <ManageAccountsDrawer
        platform={manageFor}
        onClose={() => setManageFor(null)}
      />

      <DebugPanel />
    </div>
  );
}
