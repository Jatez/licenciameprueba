import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { dashboardV2Strings } from "../../strings";
import { exportDashboardExcel, exportDashboardPDF } from "@/shared/export";

export function ExportMenu() {
  const t = dashboardV2Strings.header;
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport(format: "pdf" | "excel") {
    if (isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generando reporte…");
    try {
      if (format === "pdf") await exportDashboardPDF();
      else await exportDashboardExcel();
      toast.success("Reporte exportado correctamente", { id: toastId });
    } catch (e) {
      console.error("[export] dashboard", e);
      toast.error("No pudimos generar el reporte. Intenta nuevamente.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t.export}
          disabled={isExporting}
          className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{t.export}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem onSelect={() => handleExport("pdf")}>
          {t.exportPdf}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleExport("excel")}>
          {t.exportExcel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
