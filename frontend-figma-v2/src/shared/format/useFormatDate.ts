/**
 * Date formatters (es-CO). Exposes:
 *  - relative("...iso") → "hace 12 min" / "hace 2 días" / "ayer a las 14:32" / fallback long.
 *  - long("...iso")     → "27 de abril de 2026".
 *  - longWithTime(iso)  → "27 abr 2026, 14:32" — used in tooltips.
 */
const longFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const longWithTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
});

export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 60) return "hace unos segundos";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return `ayer a las ${shortTimeFormatter.format(new Date(iso))}`;
  if (diffD < 7) return `hace ${diffD} días`;
  return longFormatter.format(new Date(iso));
}

export function longDate(iso: string): string {
  return longFormatter.format(new Date(iso));
}

export function longDateWithTime(iso: string): string {
  return longWithTimeFormatter.format(new Date(iso));
}

export function useFormatDate() {
  return { relative: relativeDate, long: longDate, longWithTime: longDateWithTime };
}
