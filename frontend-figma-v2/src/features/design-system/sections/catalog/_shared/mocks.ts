import type {
  CatalogPageResponse,
  Genre,
  LicensablePlatform,
  PlatformLicensability,
  TrackSummary,
} from "@/api/types";

/**
 * Stable mock data for the Catalog DS sections.
 * Goal: realistic enough to render every variant/state without depending on
 * the mock generator (which is randomized per page load).
 */

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

export const MOCK_TRACKS: TrackSummary[] = [
  {
    id: "ds-track-1",
    title: "Latin Heat",
    artist: "Maya Sol",
    coverUrl: cover("ds-track-latin-heat"),
    genre: "latin" as Genre,
    moods: ["energético", "tropical"],
    durationSec: 178,
    previewUrl: "",
    waveformPeaks: null,
    popularityScore: 92,
    platformsLicensable: ["instagram", "tiktok", "facebook"] as LicensablePlatform[],
    isFavorite: true,
  },
  {
    id: "ds-track-2",
    title: "Slow Burn",
    artist: "Noah Park",
    coverUrl: cover("ds-track-slow-burn"),
    genre: "indie" as Genre,
    moods: ["melancólico", "calmado"],
    durationSec: 245,
    previewUrl: "",
    waveformPeaks: null,
    popularityScore: 73,
    platformsLicensable: ["instagram", "tiktok"] as LicensablePlatform[],
    isFavorite: false,
  },
  {
    id: "ds-track-3",
    title: "Boardroom",
    artist: "Atlas Audio",
    coverUrl: null,
    genre: "corporate" as Genre,
    moods: ["profesional"],
    durationSec: 92,
    previewUrl: "",
    waveformPeaks: null,
    popularityScore: 51,
    platformsLicensable: ["facebook"] as LicensablePlatform[],
    isFavorite: false,
  },
  {
    id: "ds-track-4",
    title: "Neon Run",
    artist: "Vela Kim",
    coverUrl: cover("ds-track-neon-run"),
    genre: "electronic" as Genre,
    moods: ["energético", "futurista"],
    durationSec: 198,
    previewUrl: "",
    waveformPeaks: null,
    popularityScore: 88,
    platformsLicensable: ["instagram", "tiktok", "facebook"] as LicensablePlatform[],
    isFavorite: false,
  },
];

export const MOCK_TRACKS_SIMILAR: TrackSummary[] = [
  ...MOCK_TRACKS,
  {
    id: "ds-track-5",
    title: "Amanecer",
    artist: "Río Verde",
    coverUrl: cover("ds-track-amanecer"),
    genre: "acoustic" as Genre,
    moods: ["calmado"],
    durationSec: 210,
    previewUrl: "",
    waveformPeaks: null,
    popularityScore: 65,
    platformsLicensable: ["instagram"] as LicensablePlatform[],
    isFavorite: false,
  },
  {
    id: "ds-track-6",
    title: "City Lights",
    artist: "Lumen",
    coverUrl: cover("ds-track-city-lights"),
    genre: "pop" as Genre,
    moods: ["alegre"],
    durationSec: 165,
    previewUrl: "",
    waveformPeaks: null,
    popularityScore: 79,
    platformsLicensable: ["instagram", "facebook"] as LicensablePlatform[],
    isFavorite: false,
  },
];

export const MOCK_LICENSABILITY_MATRIX: PlatformLicensability[] = [
  {
    platform: "instagram",
    allowed: true,
    allowedUsageTypes: [
      "single-use",
      "stories-pack",
      "monthly-extended",
      "long-video",
      "paid-post",
    ],
    maxDurationSec: 60,
    notes: null,
  },
  {
    platform: "tiktok",
    allowed: true,
    allowedUsageTypes: ["single-use", "stories-pack", "paid-post", "collaborative-post"],
    maxDurationSec: null,
    notes: "Solo para creadores verificados",
  },
  {
    platform: "facebook",
    allowed: false,
    allowedUsageTypes: [],
    maxDurationSec: null,
    notes: null,
  },
];

export const MOCK_FILTER_DATA: CatalogPageResponse = {
  tracks: MOCK_TRACKS,
  page: 1,
  pageSize: 25,
  totalTracks: 1245,
  totalPages: 50,
  appliedFilters: {
    search: "",
    genres: [],
    moods: [],
    durationRange: null,
    platforms: [],
    onlyFavorites: false,
    sort: "popularity-desc",
  },
  availableGenres: [
    { genre: "latin" as Genre, count: 312 },
    { genre: "pop" as Genre, count: 287 },
    { genre: "electronic" as Genre, count: 198 },
    { genre: "indie" as Genre, count: 154 },
    { genre: "corporate" as Genre, count: 121 },
    { genre: "acoustic" as Genre, count: 96 },
  ],
  availableMoods: [
    { mood: "energético", count: 412 },
    { mood: "calmado", count: 287 },
    { mood: "alegre", count: 198 },
    { mood: "melancólico", count: 134 },
    { mood: "profesional", count: 88 },
  ],
  suggestedSearches: ["reggaeton", "lo-fi", "épico"],
};
