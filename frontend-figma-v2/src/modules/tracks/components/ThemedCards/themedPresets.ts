import type { CatalogFilters, Genre, LicensablePlatform, Mood } from "@/api/types";

export interface ThemedPreset {
  id: "reels" | "events" | "corporate" | "podcasts";
  filters: Partial<CatalogFilters>;
  image: string;
}

/** Stable seed-based covers from picsum so the cards have visual identity. */
export const THEMED_PRESETS: ThemedPreset[] = [
  {
    id: "reels",
    filters: {
      durationRange: { minSec: 0, maxSec: 60 },
      platforms: ["instagram", "tiktok"] as LicensablePlatform[],
    },
    image: "https://picsum.photos/seed/themed-reels/640/400",
  },
  {
    id: "events",
    filters: {
      genres: ["latin", "pop", "rock"] as Genre[],
    },
    image: "https://picsum.photos/seed/themed-events/640/400",
  },
  {
    id: "corporate",
    filters: {
      genres: ["corporate", "ambient", "cinematic"] as Genre[],
    },
    image: "https://picsum.photos/seed/themed-corporate/640/400",
  },
  {
    id: "podcasts",
    filters: {
      moods: ["calmado", "ambiental"] as Mood[],
      genres: ["ambient", "acoustic", "folk"] as Genre[],
    },
    image: "https://picsum.photos/seed/themed-podcasts/640/400",
  },
];
