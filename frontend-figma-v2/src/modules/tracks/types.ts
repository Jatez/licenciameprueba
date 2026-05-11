export type {
  CatalogFilters,
  CatalogPageRequest,
  CatalogPageResponse,
  CatalogPageSize,
  CatalogSortOption,
  DurationRange,
  Genre,
  LicensablePlatform,
  Mood,
  PlatformLicensability,
  ToggleFavoriteRequest,
  ToggleFavoriteResponse,
  Track,
  TrackDetailResponse,
  TrackSummary,
} from "@/api/types";

/** Local-only types used by the catalog UI layer. */
export type FiltersDrawerState = "closed" | "open";

export interface CatalogUrlState {
  search: string;
  page: number;
  pageSize: 25 | 50 | 100;
  sort: import("@/api/types").CatalogSortOption;
  genres: import("@/api/types").Genre[];
  moods: string[];
  platforms: import("@/api/types").LicensablePlatform[];
  onlyFavorites: boolean;
  durationMin: number | null;
  durationMax: number | null;
}
