import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTrackingStore } from "@/stores/trackingStore";
import type { License } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface ExpiredBeforePublishStateProps {
  license: License;
}

export function ExpiredBeforePublishState({ license }: ExpiredBeforePublishStateProps) {
  const navigate = useNavigate();
  const openManualLink = useTrackingStore((s) => s.openManualLinkDialog);
  const t = trackingStrings.associatedContent.expiredBeforePublish;

  return (
    <div className="space-y-3">
      <Alert variant="destructive">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>{t.title}</AlertTitle>
        <AlertDescription>
          {t.description.replace("{credits}", String(license.creditsConsumed))}
        </AlertDescription>
      </Alert>

      <p className="text-sm text-muted-foreground">{t.lateReportHint}</p>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => openManualLink(license.id)}>
          {t.reportLateCta}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/license/new?trackId=${license.trackId}`)}
        >
          {t.newLicenseCta}
        </Button>
      </div>
    </div>
  );
}
