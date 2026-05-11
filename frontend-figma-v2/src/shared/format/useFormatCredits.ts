/**
 * Credit count formatter (es-CO). No decimals, locale-aware grouping.
 */
const creditFormatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

export function formatCredits(n: number): string {
  return creditFormatter.format(n);
}

export function useFormatCredits() {
  return formatCredits;
}
