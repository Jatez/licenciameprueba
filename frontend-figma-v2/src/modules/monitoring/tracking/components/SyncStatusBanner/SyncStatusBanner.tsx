import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Ban, RefreshCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSyncStatus, useTriggerManualSync } from "@/modules/monitoring/tracking/hooks";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";
import { PlatformStatusChip } from "./PlatformStatusChip";

const VARIANT_STYLES = {
  healthy: {
    container: "border-success/40 bg-success-subtle/40",
    icon: CheckCircle2,
    iconColor: "text-foreground",
  },
  degraded: {
    container: "border-warning/40 bg-warning-subtle/40",
    icon: AlertTriangle,
    iconColor: "text-foreground",
  },
  unavailable: {
    container: "border-destructive/40 bg-error-subtle/40",
    icon: Ban,
    iconColor: "text-foreground",
  },
} as const;

export function SyncStatusBanner() {
  const { data, isLoading, isError } = useSyncStatus();
  const triggerSync = useTriggerManualSync();
  const navigate = useNavigate();
  const t = trackingStrings.syncStatus;

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-lg" aria-busy="true" />;
  }

  if (isError || !data || !data.platforms) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/40 bg-error-subtle/40 p-4 text-sm text-foreground"
      >
        No pudimos consultar el estado de sincronización.
      </div>
    );
  }

  const variant = VARIANT_STYLES[data.overallStatus as keyof typeof VARIANT_STYLES] ?? VARIANT_STYLES.degraded;
  const Icon = variant.icon;

  const lastSyncIso = data.platforms
    .map((p) => p.lastSyncAt)
    .filter((v): v is string => !!v)
    .sort()
    .pop();

  const title =
    data.overallStatus === "healthy"
      ? t.healthy
      : data.overallStatus === "degraded"
        ? t.degraded
        : t.unavailable;

  const subline = lastSyncIso
    ? t.lastSync.replace("{duration}", formatRelativeFromNow(lastSyncIso))
    : "—";

  const handleSync = () => {
    triggerSync.mutate(undefined, {
      onSuccess: () => toast.success(t.manualSyncSuccess),
      onError: () => toast.error(t.manualSyncError),
    });
  };

  return (
    <section
      aria-live="polite"
      className={`rounded-lg border p-4 ${variant.container}`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Icon size={22} className={variant.iconColor} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subline}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.platforms.map((p) => (
            <PlatformStatusChip key={p.platform} platform={p} />
          ))}
        </div>

        <div className="flex shrink-0 items-center">
          {data.overallStatus === "unavailable" ? (
            <Button onClick={() => navigate("/social-accounts")}>
              {t.goToSocialAccounts}
            </Button>
          ) : (
            <Button
              variant={data.overallStatus === "degraded" ? "default" : "outline"}
              onClick={handleSync}
              disabled={triggerSync.isPending}
            >
              {triggerSync.isPending ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" aria-hidden="true" />
                  {t.manualSyncRunning}
                </>
              ) : (
                <>
                  <RefreshCcw size={14} className="mr-1.5" aria-hidden="true" />
                  {t.manualSync}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
