/**
 * F-11 · Pure: text search over publications (track title, artist, post URL).
 * Case- and accent-insensitive.
 */
import type { PublicationMetric } from "../types";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchPublications(
  publications: readonly PublicationMetric[],
  query: string,
): PublicationMetric[] {
  const q = normalize(query.trim());
  if (!q) return publications.slice();
  return publications.filter((p) => {
    const haystack = normalize(`${p.trackTitle} ${p.trackArtist} ${p.postUrl}`);
    return haystack.includes(q);
  });
}
