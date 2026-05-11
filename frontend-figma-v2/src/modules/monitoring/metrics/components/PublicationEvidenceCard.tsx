import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyableField } from "@/modules/monitoring/metrics/components/CopyableField";
import { PublicationStatusBadge } from "@/modules/monitoring/metrics/components/PublicationStatusBadge";
import { formatPercentage, formatCredits } from "@/shared/utils";
import {
  metricsStrings,
  useTypeLabels,
} from "@/modules/monitoring/metrics/strings";
import type { PublicationMetric } from "@/modules/monitoring/metrics/types";

export interface PublicationEvidenceCardProps {
  pub: PublicationMetric;
  absoluteDate: (iso: string) => string;
  onDownload: () => void;
}

export function PublicationEvidenceCard({
  pub,
  absoluteDate,
  onDownload,
}: PublicationEvidenceCardProps) {
  const t = metricsStrings.publicationDetail;
  const interactions = pub.likes + pub.comments + pub.shares + pub.saves;
  const engagementPct = pub.views === 0 ? 0 : (interactions / pub.views) * 100;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-semibold text-foreground">{t.evidenceTitle}</h3>
      <div className="flex flex-col divide-y divide-foreground/5">
        <CopyableField label={t.evidenceFields.licenseId} value={pub.licenseId} />
        <CopyableField
          label={t.evidenceFields.useType}
          value={pub.licenseUseType}
          display={useTypeLabels[pub.licenseUseType]}
        />
        <CopyableField
          label={t.evidenceFields.licenseStatus}
          value={pub.licenseStatus}
          display={<PublicationStatusBadge status="synced" />}
        />
        <CopyableField
          label={t.evidenceFields.credits}
          value={String(pub.creditsSpent)}
          display={<span>{formatCredits(pub.creditsSpent)}</span>}
        />
        <CopyableField label={t.evidenceFields.externalId} value={pub.postExternalId} />
        <CopyableField
          label={t.evidenceFields.lastSync}
          value={pub.lastSyncedAt ?? "—"}
          display={pub.lastSyncedAt ? absoluteDate(pub.lastSyncedAt) : "—"}
        />
        <CopyableField
          label="Engagement"
          value={formatPercentage(engagementPct)}
          display={formatPercentage(engagementPct)}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to={`/licenses/${pub.licenseId}`}>{t.viewLicense}</Link>
        </Button>
        <Button onClick={onDownload} size="sm" className="gap-1.5">
          <Download className="h-4 w-4" aria-hidden="true" />
          {t.downloadEvidence}
        </Button>
      </div>
    </Card>
  );
}