import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PublicationStatusBadge } from "@/modules/monitoring/metrics/components/PublicationStatusBadge";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";
import type { PublicationMetric } from "@/modules/monitoring/metrics/types";

export interface PublicationSyncStatusProps {
  pub: PublicationMetric;
  absoluteDate: (iso: string) => string;
  relativeDate: (iso: string) => string;
  onRetry: () => void;
}

export function PublicationSyncStatus({
  pub,
  absoluteDate,
  relativeDate,
  onRetry,
}: PublicationSyncStatusProps) {
  const t = metricsStrings.publicationDetail;
  const hasIssue = pub.syncStatus === "failed" || pub.syncStatus === "partial";
  return (
    <Card className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-semibold text-foreground">{t.syncTitle}</h3>
      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-foreground/50">{t.syncLast}</p>
          <p className="mt-0.5 text-foreground">
            {pub.lastSyncedAt
              ? `${absoluteDate(pub.lastSyncedAt)} (${relativeDate(pub.lastSyncedAt)})`
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-foreground/50">{t.syncNext}</p>
          <p className="mt-0.5 text-foreground">{t.syncNextValue}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-foreground/50">Estado</p>
          <div className="mt-0.5">
            <PublicationStatusBadge status={pub.syncStatus} syncError={pub.syncError} />
          </div>
        </div>
      </div>

      {hasIssue && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>{t.syncIssueTitle}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>{pub.syncError ?? "Algunas métricas no se pudieron consolidar."}</span>
            <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              {t.syncRetry}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}