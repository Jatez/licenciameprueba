import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

export function NoDetectionsYet() {
  const navigate = useNavigate();
  const open = useTrackingStore((s) => s.openManualLinkDialog);
  const t = trackingStrings.monitoring.empty.noDetections;

  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Radio size={36} className="text-muted-foreground" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{t.message}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => navigate("/catalog")}>{t.primaryCta}</Button>
        <Button variant="outline" onClick={() => open()}>
          {t.secondaryCta}
        </Button>
      </div>
    </Card>
  );
}
