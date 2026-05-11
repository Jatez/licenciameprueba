/**
 * F-11 · Route definitions for the metrics module.
 * UI is intentionally a placeholder — Prompts 2 and 3 will replace each page.
 */
export const metricsRoutes = {
  overview: "/metricas",
  publicationDetail: "/metricas/publicaciones/:id",
  reportsHistory: "/metricas/reportes",
} as const;

export function publicationDetailPath(id: string): string {
  return `/metricas/publicaciones/${id}`;
}
