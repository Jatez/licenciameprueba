/**
 * Percent formatter. Input is already a percent number (e.g. 4.2 → "4,2 %").
 * `signed` prefixes "+" for positives (used for delta chips).
 */
export function formatPercent(
  value: number,
  options: { decimals?: number; signed?: boolean } = {},
): string {
  const { decimals = 1, signed = false } = options;
  const fixed = value.toFixed(decimals);
  const normalized = fixed.replace(".", ",");
  const prefix = signed && value > 0 ? "+" : "";
  return `${prefix}${normalized} %`;
}
