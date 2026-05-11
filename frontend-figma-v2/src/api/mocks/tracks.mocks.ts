import type { Track } from "@/api/types";
import {
  TOTAL_MOCK_TRACKS,
  generateTracks,
  platformsLicensableFor,
} from "./tracks.generator";

/**
 * Lazy singleton — first read materialises the full 15K catalog, then keeps it
 * in memory. Because the generator is seeded, IDs and metadata are stable.
 */
let cachedTracks: Track[] | null = null;

export function getAllMockTracks(): Track[] {
  if (cachedTracks) return cachedTracks;
  cachedTracks = generateTracks(TOTAL_MOCK_TRACKS);
  return cachedTracks;
}

export { platformsLicensableFor };

// ─── Named fixtures for manual QA ────────────────────────────────────────────

/** Hit with full metadata: cover, waveform, moods, all platforms. */
export const MOCK_TRACK_POPULAR: Track = {
  id: "mock-popular",
  title: "Aurora cardinal",
  artist: "Luna Cortés",
  album: "Aurora cardinal (Single)",
  coverUrl: "https://picsum.photos/seed/mock-popular/400/400",
  genre: "pop",
  moods: ["energético", "alegre", "motivacional"],
  durationSec: 184,
  bpm: 122,
  tags: ["upbeat", "anthemic", "modern"],
  releaseYear: 2025,
  language: "es",
  previewUrl: "https://mock.licenciame.local/preview/mock-popular.mp3",
  waveformPeaks: Array.from({ length: 200 }, (_, i) => 0.4 + 0.4 * Math.abs(Math.sin(i / 6))),
  popularityScore: 96,
  isrc: "MX-000001",
  platformLicensability: [
    { platform: "instagram", allowed: true, allowedUsageTypes: ["single-use", "stories-pack", "monthly-extended", "long-video", "paid-post", "collaborative-post"], maxDurationSec: null, notes: null },
    { platform: "tiktok", allowed: true, allowedUsageTypes: ["single-use", "stories-pack", "monthly-extended", "long-video", "paid-post", "collaborative-post"], maxDurationSec: null, notes: null },
    { platform: "facebook", allowed: true, allowedUsageTypes: ["single-use", "stories-pack", "monthly-extended", "long-video", "paid-post", "collaborative-post"], maxDurationSec: null, notes: null },
  ],
  licensesIssuedCount: 412,
  isFavorite: true,
  createdAt: "2025-03-10T00:00:00.000Z",
};

/** Worst-case metadata: missing cover, waveform, moods, album, bpm, year. */
export const MOCK_TRACK_INCOMPLETE_METADATA: Track = {
  id: "mock-incomplete",
  title: "Sin nombre",
  artist: "Artista desconocido",
  album: null,
  coverUrl: null,
  genre: "indie",
  moods: [],
  durationSec: 142,
  bpm: null,
  tags: [],
  releaseYear: null,
  language: null,
  previewUrl: "https://mock.licenciame.local/preview/mock-incomplete.mp3",
  waveformPeaks: null,
  popularityScore: 28,
  isrc: null,
  platformLicensability: [
    { platform: "instagram", allowed: true, allowedUsageTypes: ["single-use", "stories-pack"], maxDurationSec: null, notes: null },
    { platform: "tiktok", allowed: true, allowedUsageTypes: ["single-use", "stories-pack"], maxDurationSec: null, notes: null },
    { platform: "facebook", allowed: true, allowedUsageTypes: ["single-use", "stories-pack"], maxDurationSec: null, notes: null },
  ],
  licensesIssuedCount: 3,
  isFavorite: false,
  createdAt: "2024-08-20T00:00:00.000Z",
};

/** Restricted: only Instagram, no paid-post. */
export const MOCK_TRACK_RESTRICTED: Track = {
  id: "mock-restricted",
  title: "Eclipse boreal",
  artist: "The Northern Lights",
  album: "Boreal",
  coverUrl: "https://picsum.photos/seed/mock-restricted/400/400",
  genre: "electronic",
  moods: ["dramático", "tenso"],
  durationSec: 211,
  bpm: 128,
  tags: ["cinematic", "cold"],
  releaseYear: 2024,
  language: "en",
  previewUrl: "https://mock.licenciame.local/preview/mock-restricted.mp3",
  waveformPeaks: Array.from({ length: 200 }, (_, i) => 0.2 + 0.6 * Math.abs(Math.cos(i / 8))),
  popularityScore: 71,
  isrc: "MX-000002",
  platformLicensability: [
    { platform: "instagram", allowed: true, allowedUsageTypes: ["single-use", "stories-pack", "monthly-extended", "long-video"], maxDurationSec: 60, notes: "No disponible para publicaciones con pauta." },
    { platform: "tiktok", allowed: false, allowedUsageTypes: [], maxDurationSec: null, notes: "Restringido por el catálogo." },
    { platform: "facebook", allowed: false, allowedUsageTypes: [], maxDurationSec: null, notes: "Restringido por el catálogo." },
  ],
  licensesIssuedCount: 41,
  isFavorite: false,
  createdAt: "2024-11-05T00:00:00.000Z",
};

/**
 * NOT included in `getAllMockTracks()`. Reserved for the `TRACK_REMOVED`
 * edge case — the endpoint throws when this id is requested.
 */
export const MOCK_TRACK_REMOVED_ID = "mock-removed";
