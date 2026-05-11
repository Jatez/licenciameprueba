/**
 * F-11 · Zustand store for the asynchronous report-export flow.
 *
 * Behavior simulated:
 *  - One activeJob at a time + history.
 *  - startExport: queued → generating → progress ticks → ready/failed.
 *  - Total simulated duration depends on row volume (heuristic by filter).
 *  - cancelExport: only valid while queued/generating.
 *  - dismissJob: archives activeJob into history.
 */
import { create } from "zustand";
import { mockReportHistory } from "../mocks/reports";
import { filterPublications } from "../selectors/filterPublications";
import { getActiveScenario, getPublicationsForScenario } from "../mocks";
import type { ReportConfig, ReportJob, ReportJobStatus } from "../types";

interface ExportStore {
  activeJob: ReportJob | null;
  history: ReportJob[];
  startExport: (config: ReportConfig) => void;
  cancelExport: () => void;
  dismissJob: () => void;
}

interface InternalTimers {
  initialTimeout: ReturnType<typeof setTimeout> | null;
  tickInterval: ReturnType<typeof setInterval> | null;
}

const timers: InternalTimers = { initialTimeout: null, tickInterval: null };

function clearTimers(): void {
  if (timers.initialTimeout !== null) {
    clearTimeout(timers.initialTimeout);
    timers.initialTimeout = null;
  }
  if (timers.tickInterval !== null) {
    clearInterval(timers.tickInterval);
    timers.tickInterval = null;
  }
}

function estimateRowCount(config: ReportConfig): number {
  const scenario = getActiveScenario();
  const all = getPublicationsForScenario(scenario);
  return filterPublications(all, config.filter).length;
}

function estimateDurationMs(rowCount: number): number {
  if (rowCount < 50) return 3500;
  if (rowCount <= 200) return 7000;
  return 16000;
}

function estimateFileSize(rowCount: number, format: ReportConfig["format"]): string {
  // Rough heuristic: bigger for PDF (fonts, layout), smaller for Excel.
  const kbPerRow = format === "pdf" ? 28 : 6;
  const kb = Math.max(40, rowCount * kbPerRow);
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function shouldFailJob(config: ReportConfig): boolean {
  return (
    config.filter.syncStatusFilter === "with_issues" &&
    getActiveScenario() === "partial"
  );
}

function generateJobId(): string {
  return `rep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useExportStore = create<ExportStore>((set, get) => ({
  activeJob: null,
  history: mockReportHistory,

  startExport: (config) => {
    clearTimers();
    const rowCount = estimateRowCount(config);
    const totalMs = estimateDurationMs(rowCount);
    const willFail = shouldFailJob(config);

    const job: ReportJob = {
      id: generateJobId(),
      config,
      status: "queued",
      progress: 0,
      estimatedSeconds: Math.round(totalMs / 1000),
      fileUrl: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      rowCount,
    };
    set({ activeJob: job });

    // queued → generating after 600ms
    timers.initialTimeout = setTimeout(() => {
      const current = get().activeJob;
      if (!current || current.id !== job.id) return;
      set({ activeJob: { ...current, status: "generating", progress: 15 } });

      const tickEveryMs = 800;
      // Failure path: short-circuit at ~4s
      if (willFail) {
        timers.initialTimeout = setTimeout(() => {
          const c = get().activeJob;
          if (!c || c.id !== job.id) return;
          finishJob(set, c, "failed", {
            errorMessage:
              "No se pudo consolidar la evidencia. Reintenta en unos minutos.",
          });
        }, 4000);
        return;
      }

      timers.tickInterval = setInterval(() => {
        const c = get().activeJob;
        if (!c || c.id !== job.id || c.status !== "generating") {
          clearTimers();
          return;
        }
        const remaining = 100 - c.progress;
        const step = Math.min(remaining, 10 + Math.floor(Math.random() * 16));
        const next = Math.min(100, c.progress + step);
        if (next >= 100) {
          clearTimers();
          finishJob(set, c, "ready", {
            fileUrl: `mock://reports/${c.id}`,
            fileSize: estimateFileSize(c.rowCount ?? 0, c.config.format),
          });
        } else {
          set({ activeJob: { ...c, progress: next } });
        }
      }, tickEveryMs);
    }, 600);
  },

  cancelExport: () => {
    const c = get().activeJob;
    if (!c) return;
    if (c.status !== "queued" && c.status !== "generating") return;
    clearTimers();
    set({ activeJob: null });
  },

  dismissJob: () => {
    const c = get().activeJob;
    if (!c) return;
    clearTimers();
    set((state) => ({
      activeJob: null,
      history: [c, ...state.history],
    }));
  },
}));

function finishJob(
  set: (partial: Partial<ExportStore>) => void,
  current: ReportJob,
  status: Extract<ReportJobStatus, "ready" | "failed">,
  patch: Partial<ReportJob>,
): void {
  set({
    activeJob: {
      ...current,
      ...patch,
      status,
      progress: status === "ready" ? 100 : current.progress,
      completedAt: new Date().toISOString(),
    },
  });
}
