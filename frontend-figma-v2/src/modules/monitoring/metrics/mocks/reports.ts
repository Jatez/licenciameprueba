/**
 * F-11 · Pre-existing report jobs (history) for the export flow.
 * Used by the reports history view (Prompt 3).
 */
import type { ReportJob } from "../types";
import { isoDaysAgo } from "./utils";

const baseConfig = {
  filter: {
    period: "last_30_days" as const,
    platforms: [],
    useTypes: [],
    trackId: null,
    syncStatusFilter: "all" as const,
  },
  content: {
    includeExecutiveSummary: true,
    includeLicenses: true,
    includeCreditsMovement: true,
    includePublications: true,
    includeMetrics: true,
    includeEvidence: true,
    includeTopTracks: true,
  },
  language: "es" as const,
};

export const mockReportHistory: ReportJob[] = [
  {
    id: "rep_2026_04_15_a1",
    config: {
      ...baseConfig,
      format: "pdf",
      fileName: "metricas_marzo_2026.pdf",
    },
    status: "ready",
    progress: 100,
    estimatedSeconds: null,
    fileUrl: "mock://reports/rep_2026_04_15_a1",
    createdAt: isoDaysAgo(12, 0),
    completedAt: isoDaysAgo(12, -1),
    rowCount: 47,
    fileSize: "1.2 MB",
  },
  {
    id: "rep_2026_03_28_b2",
    config: {
      ...baseConfig,
      format: "excel",
      fileName: "consumo_creditos_q1.xlsx",
      content: { ...baseConfig.content, includeEvidence: false },
    },
    status: "ready",
    progress: 100,
    estimatedSeconds: null,
    fileUrl: "mock://reports/rep_2026_03_28_b2",
    createdAt: isoDaysAgo(30, 0),
    completedAt: isoDaysAgo(30, -1),
    rowCount: 132,
    fileSize: "284 KB",
  },
  {
    id: "rep_2026_03_02_c3",
    config: {
      ...baseConfig,
      format: "pdf",
      fileName: "reporte_febrero_2026.pdf",
    },
    status: "failed",
    progress: 42,
    estimatedSeconds: null,
    fileUrl: null,
    createdAt: isoDaysAgo(56, 0),
    completedAt: isoDaysAgo(56, -1),
    errorMessage: "No se pudo consolidar la evidencia. Reintenta en unos minutos.",
  },
];
