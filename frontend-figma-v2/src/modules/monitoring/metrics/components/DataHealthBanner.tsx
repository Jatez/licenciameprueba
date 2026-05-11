/**
 * F-11 · Data health banner.
 *
 * Composes the shadcn `<Alert>` primitive with semantic warning/error tokens.
 * Three states (decided by `kind`):
 *  - "stale"     → warning (>3h since last sync).
 *  - "failed"    → error  (>=3 failed OR (failed+partial)/expected > 0.15).
 *  - "combined"  → error + stale collapsed into a single banner.
 *
 * Hidden when none of the conditions apply.
 */
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormatDate } from "@/shared/format";
import type { DataHealth } from "../types";
import { metricsStrings } from "../strings";
import { interpolateString } from "../utils";

interface DataHealthBannerProps {
  health: DataHealth;
  onSyncNow: () => void;
  onSeeIssues: () => void;
}

type BannerKind = "stale" | "failed" | "combined" | null;

function resolveKind(h: DataHealth): BannerKind {
  const failedRatio =
    h.totalExpected === 0
      ? 0
      : (h.totalFailed + h.totalPartial) / h.totalExpected;
  const hasFailures = h.totalFailed >= 3 || failedRatio > 0.15;

  if (h.isStale && hasFailures) return "combined";
  if (hasFailures) return "failed";
  if (h.isStale) return "stale";
  return null;
}

export function DataHealthBanner({
  health,
  onSyncNow,
  onSeeIssues,
}: DataHealthBannerProps) {
  const { relative } = useFormatDate();
  const kind = resolveKind(health);
  if (!kind) return null;

  const isError = kind !== "stale";
  const containerClass = isError
    ? "border-error-subtle bg-error-subtle"
    : "border-warning-subtle bg-warning-subtle";
  const iconClass = isError ? "text-foreground" : "text-foreground";

  let title = "";
  let message = "";
  if (kind === "stale") {
    title = metricsStrings.health.staleTitle;
    message = interpolateString(metricsStrings.health.staleMessage, {
      when: relative(health.lastGlobalSyncAt),
    });
  } else if (kind === "failed") {
    title = metricsStrings.health.failedTitle;
    message = interpolateString(metricsStrings.health.failedMessage, {
      count: health.totalFailed + health.totalPartial,
    });
  } else {
    title = metricsStrings.health.combinedTitle;
    message = interpolateString(metricsStrings.health.combinedMessage, {
      when: relative(health.lastGlobalSyncAt),
      count: health.totalFailed + health.totalPartial,
    });
  }

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start ${containerClass}`}
    >
      <AlertTriangle
        className={`h-5 w-5 flex-shrink-0 ${iconClass}`}
        aria-hidden="true"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-foreground/80">{message}</p>
      </div>
      <div className="flex flex-shrink-0 flex-wrap gap-2">
        {(kind === "stale" || kind === "combined") && (
          <Button
            size="sm"
            variant="outline"
            onClick={onSyncNow}
            className="h-8 gap-1.5 bg-background text-xs"
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {metricsStrings.health.syncNow}
          </Button>
        )}
        {(kind === "failed" || kind === "combined") && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onSeeIssues}
            className="h-8 text-xs"
          >
            {metricsStrings.health.seeIssues}
          </Button>
        )}
      </div>
    </div>
  );
}
