/**
 * Chart palette — fuente única de verdad para colores de series en charts.
 *
 * Los valores reales viven en `src/index.css` como `--chart-1..6` y están
 * expuestos en Tailwind como `bg-chart-1..6` / `text-chart-1..6`.
 *
 * Reglas:
 * - Solo para datos NO semánticos (categorías sin jerarquía).
 * - No usar para feedback (success/error/warning → tokens semánticos).
 * - Nunca hardcodear hex; consumir esta tabla o las clases `bg-chart-N`.
 */
export const CHART_PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
] as const;

export type ChartSlot = 1 | 2 | 3 | 4 | 5 | 6;

export const chartColor = (slot: ChartSlot): string => CHART_PALETTE[slot - 1];
