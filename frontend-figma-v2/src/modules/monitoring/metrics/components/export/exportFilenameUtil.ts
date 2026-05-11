/**
 * F-11 · Suggests a default filename for an export, deterministic & readable.
 *
 * Format: licenciame_reporte_<periodo>_<YYYYMMDD>.<ext>
 * Example: licenciame_reporte_ultimos-30-dias_20260427.pdf
 */
import type { MetricsFilter, ReportFormat } from "../../types";

const periodSlugs: Record<MetricsFilter["period"], string> = {
  last_7_days: "ultimos-7-dias",
  last_30_days: "ultimos-30-dias",
  last_90_days: "ultimos-90-dias",
  this_month: "este-mes",
  last_month: "mes-pasado",
  custom: "personalizado",
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function todayStamp(now: Date = new Date()): string {
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
}

export function suggestExportFilename(
  filter: MetricsFilter,
  format: ReportFormat,
  now?: Date,
): string {
  const ext = format === "pdf" ? "pdf" : "xlsx";
  const periodSlug = periodSlugs[filter.period];
  return `licenciame_reporte_${periodSlug}_${todayStamp(now)}.${ext}`;
}

export function changeFilenameExtension(filename: string, format: ReportFormat): string {
  const ext = format === "pdf" ? "pdf" : "xlsx";
  return filename.replace(/\.[^./]+$/, "") + "." + ext;
}
