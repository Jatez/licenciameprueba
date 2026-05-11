export type SpotifyMatchStatus = "matched" | "partial" | "not_available" | "removed";

export interface SpotifyPlaylistMeta {
  id: string;
  name: string;
  owner: string;
  totalTracks: number;
  durationLabel: string;
  source: "spotify";
  analyzedAt: string;
}

export interface SpotifyTrackResult {
  id: string;
  spotifyTitle: string;
  artist: string;
  album: string;
  status: SpotifyMatchStatus;
  confidence?: number; // 0-100, undefined for removed
  catalogTitle?: string;
  credits?: number;
}

export type SpotifyAnalyzePhase =
  | "idle"
  | "analyzing"
  | "results"
  | "results_zero"
  | "error";
