const DT = new Intl.DateTimeFormat("es-CO", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});
const DTH = new Intl.DateTimeFormat("es-CO", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return DT.format(new Date(iso));
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return DTH.format(new Date(iso));
}

export function daysBetween(from: string, to: string = new Date().toISOString()): number {
  const ms = new Date(from).getTime() - new Date(to).getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
