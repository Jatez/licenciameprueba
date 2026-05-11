/**
 * Compact number formatter (es-CO): 892 → "892", 1200 → "1,2 K", 1_400_000 → "1,4 M".
 * Shared across features. Stateless: returned function is safe to memo.
 */
const compactFormatter = new Intl.NumberFormat("es-CO", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompactNumber(n: number): string {
  return compactFormatter.format(n);
}

export function useFormatCompactNumber() {
  return formatCompactNumber;
}
