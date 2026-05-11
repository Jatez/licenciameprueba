/** Colombian peso formatter. */
const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const COP_NUMBER = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export function formatCop(value: number): string {
  return COP.format(value);
}

/** Number only, no symbol. Used inside templates that already include "COP". */
export function formatCopNumber(value: number): string {
  return COP_NUMBER.format(value);
}

/** Compact form for headlines: $90M COP. */
export function formatCopCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}MM COP`;
  }
  if (value >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M COP`;
  }
  return formatCop(value);
}
