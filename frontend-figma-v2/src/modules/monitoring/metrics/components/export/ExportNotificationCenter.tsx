/**
 * F-11 · ExportNotificationCenter.
 *
 * Persistent floating notification mounted ONCE in AppLayout. Survives
 * route changes between /metricas, /metricas/publicaciones/:id and
 * /metricas/reportes (and any other route) because it's outside <Outlet>.
 *
 * Subscribes to `useExportStore.activeJob` and renders one of:
 *   - Progress card (queued / generating)
 *   - Success card (ready)
 *   - Failure card (failed)
 *   - Minimized pill (when user collapses the progress card)
 *
 * Renders nothing when there's no active job.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronUp,
  Download,
  FileText,
  History,
  Loader2,
  Maximize2,
  Minus,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { metricsStrings } from "../../strings";
import { interpolateString } from "../../utils";
import { useExportStore } from "../../stores/exportStore";
import { simulateDownload, mimeTypeForReport } from "@/shared/lib/download";

export function ExportNotificationCenter() {
  const navigate = useNavigate();
  const activeJob = useExportStore((s) => s.activeJob);
  const cancelExport = useExportStore((s) => s.cancelExport);
  const dismissJob = useExportStore((s) => s.dismissJob);
  const startExport = useExportStore((s) => s.startExport);

  const [minimized, setMinimized] = useState(false);
  const [downloadingPulse, setDownloadingPulse] = useState(false);

  // Restore (un-minimize) automatically when status transitions to ready/failed.
  useEffect(() => {
    if (!activeJob) {
      setMinimized(false);
      return;
    }
    if (activeJob.status === "ready" || activeJob.status === "failed") {
      setMinimized(false);
    }
  }, [activeJob?.status, activeJob]);

  if (!activeJob) return null;

  const t = metricsStrings.export;

  const handleDownload = () => {
    if (!activeJob) return;
    setDownloadingPulse(true);
    simulateDownload(activeJob.config.fileName, {
      mimeType: mimeTypeForReport(activeJob.config.format),
      payload: {
        jobId: activeJob.id,
        rowCount: activeJob.rowCount,
        config: activeJob.config,
      },
    });
    setTimeout(() => setDownloadingPulse(false), 1200);
  };

  const handleViewHistory = () => {
    dismissJob();
    navigate("/metricas/reportes");
  };

  const handleRetry = () => {
    if (!activeJob) return;
    const cfg = activeJob.config;
    dismissJob();
    // Defer so dismiss flushes before next start.
    setTimeout(() => startExport(cfg), 0);
  };

  // Minimized pill — only shown while in progress.
  if (
    minimized &&
    (activeJob.status === "queued" || activeJob.status === "generating")
  ) {
    return (
      <div className="fixed bottom-4 right-4 z-[60] md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="group flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-background shadow-lg transition-transform hover:-translate-y-0.5"
          aria-label={t.progress.restore}
        >
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="font-tnum text-xs font-semibold">
            {Math.round(activeJob.progress)}%
          </span>
          <ChevronUp className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm md:bottom-6 md:right-6"
    >
      {/* Card chassis */}
      <div className="overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-xl">
        {(activeJob.status === "queued" || activeJob.status === "generating") && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <FileText className="h-9 w-9 text-foreground/70" aria-hidden="true" />
                <Loader2 className="absolute -bottom-1 -right-1 h-4 w-4 animate-spin text-foreground" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {activeJob.status === "queued" ? t.progress.queued : t.progress.generating}
                </p>
                <p className="truncate text-xs text-foreground/60">
                  {activeJob.config.fileName}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  aria-label={t.progress.minimize}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Progress value={activeJob.progress} className="h-1.5" />
              <div className="flex items-center justify-between text-[11px] text-foreground/60">
                <span>
                  {activeJob.rowCount != null &&
                    interpolateString(t.progress.summaryRows, { count: activeJob.rowCount })}
                </span>
                {activeJob.estimatedSeconds != null && (
                  <span>
                    {t.progress.etaLabel}:{" "}
                    {interpolateString(t.progress.etaSeconds, {
                      seconds: activeJob.estimatedSeconds,
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={cancelExport}>
                {t.progress.cancel}
              </Button>
            </div>
          </div>
        )}

        {activeJob.status === "ready" && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="h-9 w-9 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.success.title}</p>
                <p className="truncate text-xs text-foreground/60">
                  {activeJob.config.fileName}
                  {activeJob.fileSize ? ` · ${activeJob.fileSize}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dismissJob()}
                aria-label={t.success.dismiss}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleDownload} className="flex-1 gap-1.5">
                <Download className="h-4 w-4" aria-hidden="true" />
                {downloadingPulse ? t.success.starting : t.success.download}
              </Button>
              <Button variant="outline" onClick={handleViewHistory} className="gap-1.5">
                <History className="h-4 w-4" aria-hidden="true" />
                {t.success.viewHistory}
              </Button>
            </div>
          </div>
        )}

        {activeJob.status === "failed" && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-start gap-3">
              <XCircle
                className="h-9 w-9 shrink-0 text-rose-600 dark:text-rose-400"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.failed.title}</p>
                <p className="text-xs text-foreground/60">
                  {activeJob.errorMessage ?? "Error desconocido."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dismissJob()}
                aria-label={t.failed.dismiss}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRetry} className="flex-1 gap-1.5">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {t.failed.retry}
              </Button>
              <Button variant="outline" onClick={() => dismissJob()}>
                {t.failed.dismiss}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Restore button is handled inline above when minimized. */}
      <span className="sr-only">
        <Maximize2 aria-hidden="true" />
      </span>
    </div>
  );
}
