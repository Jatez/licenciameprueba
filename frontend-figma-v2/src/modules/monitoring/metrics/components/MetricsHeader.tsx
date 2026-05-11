/**
 * F-11 · Page header. Title, subtitle, freshness pill, refresh + export CTA.
 */
import { useState } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useFormatDate } from "@/shared/format";
import { metricsStrings } from "../strings";
import { exportMetricsExcel, exportMetricsPDF } from "@/shared/export";

interface MetricsHeaderProps {
  lastSyncAt: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  /** Kept for backwards compatibility — ignored (export now runs client-side). */
  onExport?: () => void;
}

export function MetricsHeader({
  lastSyncAt,
  isRefreshing,
  onRefresh,
}: MetricsHeaderProps) {
  const { relative } = useFormatDate();
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport(format: "pdf" | "excel") {
    if (isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generando reporte…");
    try {
      if (format === "pdf") await exportMetricsPDF();
      else await exportMetricsExcel();
      toast.success("Reporte exportado correctamente", { id: toastId });
    } catch (e) {
      console.error("[export] metrics", e);
      toast.error("No pudimos generar el reporte. Intenta nuevamente.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {metricsStrings.header.title}
        </h1>
        <p className="text-sm text-foreground/60 md:text-base">
          {metricsStrings.header.subtitle}
        </p>
        {lastSyncAt && (
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-foreground/60">
            <span>
              {metricsStrings.header.lastUpdated}{" "}
              <span className="text-foreground/80">{relative(lastSyncAt)}</span>
            </span>
            <button
              type="button"
              onClick={onRefresh}
              aria-label={metricsStrings.header.refreshAria}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isExporting}
            className="self-start md:self-auto gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            {metricsStrings.header.exportButton}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          <DropdownMenuItem onSelect={() => handleExport("pdf")}>
            Descargar PDF
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleExport("excel")}>
            Descargar Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
