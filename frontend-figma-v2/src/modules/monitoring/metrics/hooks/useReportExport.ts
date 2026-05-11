/**
 * F-11 · Hook: facade over the export Zustand store.
 *
 * UI components depend only on this hook, never on the store directly.
 * Backend mapping: `POST /api/metrics/reports` + `GET /api/metrics/reports/:id`
 * for status polling. See "Notas para backend".
 */
import { useExportStore } from "../stores/exportStore";
import type { ReportConfig, ReportJob } from "../types";

interface UseReportExportResult {
  activeJob: ReportJob | null;
  history: ReportJob[];
  startExport: (config: ReportConfig) => void;
  cancelExport: () => void;
  dismissJob: () => void;
}

export function useReportExport(): UseReportExportResult {
  const activeJob = useExportStore((s) => s.activeJob);
  const history = useExportStore((s) => s.history);
  const startExport = useExportStore((s) => s.startExport);
  const cancelExport = useExportStore((s) => s.cancelExport);
  const dismissJob = useExportStore((s) => s.dismissJob);

  return { activeJob, history, startExport, cancelExport, dismissJob };
}
