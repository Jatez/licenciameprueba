import { toast } from "sonner";
import { useExportStore } from "@/modules/monitoring/metrics/stores/exportStore";
import { defaultFilter } from "@/modules/monitoring/metrics/utils";
import type { ReportConfig } from "@/modules/monitoring/metrics/types";

/**
 * Builds + dispatches the legal-grade evidence PDF for a single publication.
 * Encapsulates the side-effect so the page stays declarative.
 */
export function useEvidenceExport() {
  const startExport = useExportStore((s) => s.startExport);

  return (input: { id: string; trackId: string }) => {
    const config: ReportConfig = {
      filter: { ...defaultFilter, trackId: input.trackId },
      format: "pdf",
      content: {
        includeExecutiveSummary: false,
        includeLicenses: true,
        includeCreditsMovement: false,
        includePublications: true,
        includeMetrics: true,
        includeEvidence: true,
        includeTopTracks: false,
      },
      language: "es",
      fileName: `evidencia_${input.id}.pdf`,
    };
    startExport(config);
    toast.success("Generando evidencia. Te avisaremos cuando esté lista.");
  };
}