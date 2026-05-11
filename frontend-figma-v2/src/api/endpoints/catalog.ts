/**
 * Catalog endpoints — wired to the real backend.
 *
 * Mapping:
 *   search()           → GET  /tracks  (backend returns all tracks; filtering done client-side)
 *   getTrackById()     → GET  /tracks/:id
 *   toggleFavorite()   → no backend equivalent → no-op stub
 *   getSimilarTracks() → GET  /tracks  filtered by genre client-side
 */

import { http } from "@/api/http";
import type {
  CatalogPageRequest,
  CatalogPageResponse,
  Genre,
  Mood,
  LicensablePlatform,
  ToggleFavoriteRequest,
  ToggleFavoriteResponse,
  Track,
  TrackDetailResponse,
  TrackSummary,
} from "@/api/types";
import { featureFlags } from "@/config/featureFlags";

// ─── Adapter: backend track → frontend Track ──────────────────────────────────

function mapTrack(t: Record<string, unknown>): Track {
  return {
    id: String(t.id),
    title: String(t.title ?? ""),
    artist: String(t.artist ?? ""),
    album: t.album ? String(t.album) : undefined,
    isrc: t.isrc ? String(t.isrc) : undefined,
    genre: (t.genre as Genre) ?? "other",
    moods: (t.moods as Mood[]) ?? [],
    tags: (t.tags as string[]) ?? [],
    durationSec: Number(t.duration_seconds ?? 0),
    bpm: t.bpm ? Number(t.bpm) : undefined,
    coverUrl: t.cover_url ? String(t.cover_url) : "",
    previewUrl: t.s3_key_preview ? String(t.s3_key_preview) : "",
    waveformPeaks: (t.waveform_peaks as number[]) ?? [],
    popularityScore: Number(t.popularity_score ?? 0),
    platformLicensability: Array.isArray(t.platform_licensability) && (t.platform_licensability as unknown[]).length > 0
      ? (t.platform_licensability as Track["platformLicensability"])
      : (["instagram", "tiktok", "facebook"] as const).map((p) => ({
          platform: p,
          allowed: true,
          allowedUsageTypes: [],
          maxDurationSec: null as number | null,
          notes: null as string | null,
        })),
    isFavorite: Boolean(t.is_favorite ?? false),
    createdAt: String(t.created_at ?? new Date().toISOString()),
    rightsReference: t.rights_reference ? String(t.rights_reference) : undefined,
  };
}

function toSummary(track: Track): TrackSummary {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    coverUrl: track.coverUrl,
    genre: track.genre,
    moods: track.moods,
    durationSec: track.durationSec,
    previewUrl: track.previewUrl,
    waveformPeaks: track.waveformPeaks,
    popularityScore: track.popularityScore,
    platformsLicensable: track.platformLicensability.map((p) => p.platform as LicensablePlatform),
    isFavorite: track.isFavorite,
  };
}

// ─── Client-side filtering (backend has no search endpoint, returns all tracks) ─

function applyFilters(tracks: Track[], req: CatalogPageRequest): Track[] {
  const { filters } = req;
  const search = filters.search.trim().toLowerCase();
  const genres = new Set<Genre>(filters.genres);
  const moods = new Set<Mood>(filters.moods);
  const platforms = new Set<LicensablePlatform>(filters.platforms);

  return tracks.filter((t) => {
    if (search) {
      const haystack = `${t.title} ${t.artist} ${t.genre} ${t.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (genres.size > 0 && !genres.has(t.genre)) return false;
    if (moods.size > 0 && !t.moods.some((m) => moods.has(m))) return false;
    if (filters.durationRange) {
      const { minSec, maxSec } = filters.durationRange;
      if (t.durationSec < minSec || t.durationSec > maxSec) return false;
    }
    if (platforms.size > 0) {
      const allowed = new Set(t.platformLicensability.map((p) => p.platform as LicensablePlatform));
      let hit = false;
      for (const p of platforms) if (allowed.has(p)) { hit = true; break; }
      if (!hit) return false;
    }
    if (filters.onlyFavorites && !t.isFavorite) return false;
    return true;
  });
}

function applySort(tracks: Track[], sort: CatalogPageRequest["filters"]["sort"]): Track[] {
  const copy = tracks.slice();
  switch (sort) {
    case "popularity-desc": copy.sort((a, b) => b.popularityScore - a.popularityScore); break;
    case "recent-desc": copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "title-asc": copy.sort((a, b) => a.title.localeCompare(b.title, "es")); break;
    case "title-desc": copy.sort((a, b) => b.title.localeCompare(a.title, "es")); break;
    case "duration-asc": copy.sort((a, b) => a.durationSec - b.durationSec); break;
    case "duration-desc": copy.sort((a, b) => b.durationSec - a.durationSec); break;
    case "artist-asc": copy.sort((a, b) => a.artist.localeCompare(b.artist, "es")); break;
  }
  return copy;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const catalogApi = {
  async search(request: CatalogPageRequest): Promise<CatalogPageResponse> {
    const res = await http.get("/tracks/");
    const rawData = res.data;
    const rawItems = Array.isArray(rawData)
      ? (rawData as Record<string, unknown>[])
      : Array.isArray((rawData as Record<string, unknown>)?.results)
        ? ((rawData as Record<string, unknown>).results as Record<string, unknown>[])
        : [];
    const raw = rawItems.map(mapTrack);

    const filtered = applyFilters(raw, request);
    const sorted = applySort(filtered, request.filters.sort);
    const totalTracks = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalTracks / request.pageSize));
    const page = Math.min(Math.max(1, request.page), totalPages);
    const start = (page - 1) * request.pageSize;
    const slice = sorted.slice(start, start + request.pageSize);

    // Build facets
    const genreCounts = new Map<Genre, number>();
    const moodCounts = new Map<Mood, number>();
    for (const t of filtered) {
      genreCounts.set(t.genre, (genreCounts.get(t.genre) ?? 0) + 1);
      for (const m of t.moods) moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1);
    }

    return {
      tracks: slice.map(toSummary),
      page,
      pageSize: request.pageSize,
      totalTracks,
      totalPages,
      appliedFilters: request.filters,
      availableGenres: Array.from(genreCounts.entries())
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count),
      availableMoods: Array.from(moodCounts.entries())
        .map(([mood, count]) => ({ mood, count }))
        .sort((a, b) => b.count - a.count),
      suggestedSearches: null,
    };
  },

  async getTrackById(id: string): Promise<TrackDetailResponse> {
    const res = await http.get(`/tracks/${id}`);
    const track = mapTrack(res.data as Record<string, unknown>);

    let similarTracks: TrackSummary[] | null = null;
    if (featureFlags.FEATURE_SIMILAR_TRACKS) {
      const allRes = await http.get("/tracks/");
      const allRaw = allRes.data;
      const allItems = Array.isArray(allRaw)
        ? (allRaw as Record<string, unknown>[])
        : Array.isArray((allRaw as Record<string, unknown>)?.results)
          ? ((allRaw as Record<string, unknown>).results as Record<string, unknown>[])
          : [];
      const all = allItems.map(mapTrack);
      similarTracks = all
        .filter((t) => t.genre === track.genre && t.id !== track.id)
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 6)
        .map(toSummary);
    }

    return { track, similarTracks };
  },

  async toggleFavorite(request: ToggleFavoriteRequest): Promise<ToggleFavoriteResponse> {
    try {
      const res = await http.post(`/tracks/${request.trackId}/favorite`);
      const data = res.data as { favorited?: boolean; is_favorite?: boolean };
      return { trackId: request.trackId, isFavorite: Boolean(data.favorited ?? data.is_favorite ?? true) };
    } catch {
      // Endpoint may not exist yet — return optimistic true (toggled)
      return { trackId: request.trackId, isFavorite: true };
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const res = await http.get("/tracks/favorites");
      const data = res.data;
      if (Array.isArray(data)) {
        return data.map((item) =>
          typeof item === "string" ? item : String((item as Record<string, unknown>).id ?? item),
        );
      }
      const results = (data as Record<string, unknown>)?.results;
      if (Array.isArray(results)) {
        return results.map((item) =>
          typeof item === "string" ? item : String((item as Record<string, unknown>).id ?? item),
        );
      }
      return [];
    } catch {
      return [];
    }
  },

  async getSimilarTracks(trackId: string, limit: number): Promise<TrackSummary[]> {
    const [trackRes, allRes] = await Promise.all([
      http.get(`/tracks/${trackId}`),
      http.get("/tracks/"),
    ]);
    const track = mapTrack(trackRes.data as Record<string, unknown>);
    const allRaw2 = allRes.data;
    const allItems2 = Array.isArray(allRaw2)
      ? (allRaw2 as Record<string, unknown>[])
      : Array.isArray((allRaw2 as Record<string, unknown>)?.results)
        ? ((allRaw2 as Record<string, unknown>).results as Record<string, unknown>[])
        : [];
    const all = allItems2.map(mapTrack);
    return all
      .filter((t) => t.genre === track.genre && t.id !== track.id)
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit)
      .map(toSummary);
  },
};
