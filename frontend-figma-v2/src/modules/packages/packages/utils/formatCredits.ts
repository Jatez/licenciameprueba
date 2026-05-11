const NUMBER = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

export function formatCredits(value: number): string {
  return NUMBER.format(value);
}
