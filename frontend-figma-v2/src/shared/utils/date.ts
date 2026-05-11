/**
 * Date helpers — pure functions, locale es-CO by default.
 * Backend ships ISO-8601 strings; UI is responsible for formatting.
 */

const DEFAULT_LOCALE = "es-CO";

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: string | Date, locale: string = DEFAULT_LOCALE): string {
  return toDate(value).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date, locale: string = DEFAULT_LOCALE): string {
  return toDate(value).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function formatRelativeTime(value: string | Date, locale: string = DEFAULT_LOCALE): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffSeconds = Math.round((toDate(value).getTime() - Date.now()) / 1000);
  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= secondsInUnit || unit === "second") {
      return rtf.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }
  return rtf.format(0, "second");
}

export function formatDateRange(
  start: string | Date,
  end: string | Date,
  locale: string = DEFAULT_LOCALE,
): string {
  return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
}