/**
 * Shared helpers for client-side report export (PDF / Excel).
 * UI-first: data is read from current mock fixtures shown in the views.
 */

export type ExportPeriodLabel = string;

export interface ExportMetadata {
  reportName: string;
  scope: "dashboard" | "metricas";
  periodLabel: ExportPeriodLabel;
  periodSlug: string;
  generatedAt: Date;
  company: string;
  user: string;
  filters?: Record<string, string>;
}

export function formatExportDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatExportDateTime(date: Date = new Date()): string {
  const base = formatExportDate(date);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${base} ${hh}:${mm}`;
}

export function buildExportFilename(
  meta: ExportMetadata,
  ext: "pdf" | "xlsx",
): string {
  return `licenciame_${meta.scope}_${meta.periodSlug}_${formatExportDate(meta.generatedAt)}.${ext}`;
}

export function getCurrentExportMetadata(
  scope: "dashboard" | "metricas",
  overrides: Partial<ExportMetadata> = {},
): ExportMetadata {
  return {
    reportName:
      scope === "dashboard"
        ? "Reporte Dashboard - Licénciame"
        : "Reporte de Métricas - Licénciame",
    scope,
    periodLabel: "Últimos 30 días",
    periodSlug: "ultimos-30-dias",
    generatedAt: new Date(),
    company: "Demo Company",
    user: "User Empresa",
    ...overrides,
  };
}