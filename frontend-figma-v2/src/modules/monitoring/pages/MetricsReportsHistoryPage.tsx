/**
 * F-11 · Reports history page (route: /metricas/reportes).
 *
 * Thin orchestration: lists report jobs (minus session-deleted ones) and
 * wires the export drawer + config dialog. Heavy UI lives in components.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/shared/components";
import { simulateDownload, mimeTypeForReport } from "@/shared/lib/download";
import { useReportsHistory } from "@/modules/monitoring/metrics/hooks/useReportsHistory";
import { ExportDrawer } from "@/modules/monitoring/metrics/components/export/ExportDrawer";
import { MetricsBreadcrumb } from "@/modules/monitoring/metrics/components/MetricsBreadcrumb";
import { ReportsEmptyState } from "@/modules/monitoring/metrics/components/ReportsEmptyState";
import { ReportsHistoryTable } from "@/modules/monitoring/metrics/components/ReportsHistoryTable";
import { ReportConfigDialog } from "@/modules/monitoring/metrics/components/ReportConfigDialog";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";
import { defaultFilter } from "@/modules/monitoring/metrics/utils";
import type { ReportConfig, ReportJob } from "@/modules/monitoring/metrics/types";

const MetricsReportsHistoryPage = () => {
  const { visible, remove } = useReportsHistory();
  const t = metricsStrings.reportsHistory;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerInitial, setDrawerInitial] = useState<Partial<ReportConfig> | undefined>();
  const [configToView, setConfigToView] = useState<ReportConfig | null>(null);

  const openNewReport = () => {
    setDrawerInitial(undefined);
    setDrawerOpen(true);
  };

  const handleRegenerate = (job: ReportJob) => {
    setDrawerInitial(job.config);
    setDrawerOpen(true);
  };

  const handleDownload = (job: ReportJob) => {
    if (job.status !== "ready") return;
    toast.info(t.downloadStarting);
    simulateDownload(job.config.fileName, {
      mimeType: mimeTypeForReport(job.config.format),
      payload: { jobId: job.id, rowCount: job.rowCount, config: job.config },
    });
  };

  const handleDelete = (job: ReportJob) => {
    remove(job.id);
    toast.success(t.deleted);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <MetricsBreadcrumb
        items={[
          { label: metricsStrings.publicationDetail.breadcrumbRoot, to: "/metricas" },
          { label: t.title },
        ]}
      />

      <SectionHeader
        as="h1"
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button onClick={openNewReport} className="gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t.newReport}
          </Button>
        }
      />

      <Card className="p-0">
        {visible.length === 0 ? (
          <ReportsEmptyState onCreate={openNewReport} />
        ) : (
          <ReportsHistoryTable
            jobs={visible}
            onDownload={handleDownload}
            onRegenerate={handleRegenerate}
            onViewConfig={(job) => setConfigToView(job.config)}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <ExportDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        filter={drawerInitial?.filter ?? defaultFilter}
        initialConfig={drawerInitial}
      />

      <ReportConfigDialog
        config={configToView}
        onClose={() => setConfigToView(null)}
      />
    </div>
  );
};

export default MetricsReportsHistoryPage;
