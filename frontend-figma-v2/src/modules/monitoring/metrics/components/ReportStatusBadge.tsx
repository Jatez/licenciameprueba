import { Badge } from "@/components/ui/badge";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";
import type { ReportJob } from "@/modules/monitoring/metrics/types";

export interface ReportStatusBadgeProps {
  job: ReportJob;
}

export function ReportStatusBadge({ job }: ReportStatusBadgeProps) {
  const t = metricsStrings.reportsHistory;
  if (job.status === "ready") return <Badge variant="vigente">{t.statusReady}</Badge>;
  if (job.status === "failed") {
    return (
      <Badge variant="expirada" title={job.errorMessage}>
        {t.statusFailed}
      </Badge>
    );
  }
  return <Badge variant="consumida">{t.statusCancelled}</Badge>;
}