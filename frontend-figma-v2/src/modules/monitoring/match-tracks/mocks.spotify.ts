import type { SpotifyMatchStatus, SpotifyPlaylistMeta, SpotifyTrackResult } from "./types.spotify";

export const demoPlaylistMeta: SpotifyPlaylistMeta = {
  id: "37i9dQZF1DX_demo_q2",
  name: "Campaña Reels Q2",
  owner: "Equipo Marketing",
  totalTracks: 126,
  durationLabel: "7h 42m",
  source: "spotify",
  analyzedAt: new Date().toISOString(),
};

export const demoPlaylistSummary = {
  analyzed: 126,
  matched: 54,
  partial: 18,
  notAvailable: 54,
  matchRate: 43,
};

export const demoSpotifyTracks: SpotifyTrackResult[] = [
  {
    id: "sp_01",
    spotifyTitle: "Midnight Pulse",
    artist: "Nova Lane",
    album: "Pulse EP",
    status: "matched",
    confidence: 98,
    catalogTitle: "Midnight Pulse",
    credits: 4,
  },
  {
    id: "sp_02",
    spotifyTitle: "Corporate Motion",
    artist: "SoundLab",
    album: "Brand Tracks Vol. 3",
    status: "matched",
    confidence: 96,
    catalogTitle: "Corporate Motion",
    credits: 3,
  },
  {
    id: "sp_03",
    spotifyTitle: "Golden Reels Remix",
    artist: "Marea",
    album: "Golden Reels (Remixes)",
    status: "partial",
    confidence: 72,
    catalogTitle: "Golden Reels Original",
    credits: 5,
  },
  {
    id: "sp_04",
    spotifyTitle: "Soft Horizon Live",
    artist: "Ana Field",
    album: "Live at Bogotá",
    status: "partial",
    confidence: 68,
    catalogTitle: "Soft Horizon Studio",
    credits: 4,
  },
  {
    id: "sp_05",
    spotifyTitle: "City Lights",
    artist: "Orion Club",
    album: "Night Drive",
    status: "not_available",
    confidence: 0,
  },
  {
    id: "sp_06",
    spotifyTitle: "Event Drive",
    artist: "Pulse Unit",
    album: "Pulse Unit Vol. 2",
    status: "removed",
  },
];

export const analyzeSteps: { key: string; label: string }[] = [
  { key: "read", label: "Leyendo playlist" },
  { key: "metadata", label: "Extrayendo metadata" },
  { key: "match", label: "Cruzando contra catálogo Licénciame" },
  { key: "prepare", label: "Preparando resultados" },
];

export const SPOTIFY_STATUS_VARIANT: Record<
  SpotifyMatchStatus,
  "vigente" | "pendiente" | "expirada" | "secondary"
> = {
  matched: "vigente",
  partial: "pendiente",
  not_available: "expirada",
  removed: "secondary",
};
