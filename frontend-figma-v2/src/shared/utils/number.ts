/**
 * Number formatting helpers. All amounts are integer COP per project convention.
 */

const DEFAULT_LOCALE = "es-CO";

export function formatPercentage(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatCount(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCredits(value: number, locale: string = DEFAULT_LOCALE): string {
  return `${formatCount(value, locale)} ${value === 1 ? "crédito" : "créditos"}`;
}

export function formatCurrency(
  value: number,
  currency = "COP",
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}