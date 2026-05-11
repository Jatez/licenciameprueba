import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/shared/components/ds/ResponsiveDialog";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";
import type { ReportConfig } from "@/modules/monitoring/metrics/types";

export interface ReportConfigDialogProps {
  config: ReportConfig | null;
  onClose: () => void;
}

export function ReportConfigDialog({ config, onClose }: ReportConfigDialogProps) {
  const t = metricsStrings.reportsHistory;
  return (
    <ResponsiveDialog
      open={config !== null}
      onOpenChange={(o) => !o && onClose()}
      title={t.configModalTitle}
      initialSnap="full"
      footer={
        <Button variant="outline" onClick={onClose} className="w-full md:w-auto">
          {t.configModalClose}
        </Button>
      }
    >
      {config && (
        <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-3 text-[11px] leading-relaxed text-foreground">
          {JSON.stringify(config, null, 2)}
        </pre>
      )}
    </ResponsiveDialog>
  );
}