/**
 * Spanish-locale relative-time formatter. Wraps date-fns `formatDistance`
 * with our copy conventions (no "alrededor de", no suffix).
 */
import { formatDistanceStrict, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";

export function formatRelativeFromNow(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return formatDistanceStrict(date, new Date(), { locale: es });
}

/** Formats a future-time countdown like "6h 23m" or "12m". */
export function formatCountdownTo(iso: string | null | undefined, nowMs: number): string {
  if (!iso) return "—";
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "—";
  const diffMs = Math.max(0, target - nowMs);
  if (diffMs === 0) return "0m";

  const dur = intervalToDuration({ start: 0, end: diffMs });
  const hours = (dur.days ?? 0) * 24 + (dur.hours ?? 0);
  const minutes = dur.minutes ?? 0;

  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function isWithinNextHour(iso: string | null | undefined, nowMs: number): boolean {
  if (!iso) return false;
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return false;
  const diffMs = target - nowMs;
  return diffMs > 0 && diffMs <= 60 * 60 * 1000;
}
