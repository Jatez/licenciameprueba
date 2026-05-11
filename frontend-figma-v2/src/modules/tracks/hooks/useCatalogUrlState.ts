import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  CatalogFilters,
  CatalogPageSize,
  CatalogSortOption,
  DurationRange,
  Genre,
  LicensablePlatform,
  Mood,
} from "@/api/types";

const DEFAULT_SORT: CatalogSortOption = "popularity-desc";
const DEFAULT_PAGE_SIZE: CatalogPageSize = 50;
const VALID_SORTS: CatalogSortOption[] = [
  "popularity-desc",
  "recent-desc",
  "title-asc",
  "title-desc",
  "duration-asc",
  "duration-desc",
  "artist-asc",
];
const VALID_PAGE_SIZES: CatalogPageSize[] = [25, 50, 100];
const VALID_PLATFORMS: LicensablePlatform[] = ["instagram", "tiktok", "facebook"];

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseDuration(raw: string | null): DurationRange | null {
  if (!raw) return null;
  const [min, max] = raw.split("-").map((n) => Number.parseInt(n, 10));
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min < 0 || max < min) return null;
  return { minSec: min, maxSec: max };
}

function parseSort(raw: string | null): CatalogSortOption {
  if (raw && (VALID_SORTS as string[]).includes(raw)) return raw as CatalogSortOption;
  return DEFAULT_SORT;
}

function parsePageSize(raw: string | null): CatalogPageSize {
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  if ((VALID_PAGE_SIZES as number[]).includes(n)) return n as CatalogPageSize;
  return DEFAULT_PAGE_SIZE;
}

function parsePage(raw: string | null): number {
  const n = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parsePlatforms(raw: string | null): LicensablePlatform[] {
  return parseList(raw).filter((p): p is LicensablePlatform =>
    (VALID_PLATFORMS as string[]).includes(p),
  );
}

interface UrlStateApi {
  filters: CatalogFilters;
  page: number;
  pageSize: CatalogPageSize;
  setFilters: (patch: Partial<CatalogFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: CatalogPageSize) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * URL ↔ catalog filters/page/sort/pageSize sync.
 * Only writes params whose value differs from the default — keeps the URL clean.
 */
export function useCatalogUrlState(): UrlStateApi {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<CatalogFilters>(
    () => ({
      search: searchParams.get("q") ?? "",
      genres: parseList(searchParams.get("genres")) as Genre[],
      moods: parseList(searchParams.get("moods")) as Mood[],
      durationRange: parseDuration(searchParams.get("duration")),
      platforms: parsePlatforms(searchParams.get("platforms")),
      onlyFavorites: searchParams.get("favorites") === "true",
      sort: parseSort(searchParams.get("sort")),
    }),
    [searchParams],
  );

  const page = parsePage(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  const writeParams = useCallback(
    (next: {
      filters: CatalogFilters;
      page: number;
      pageSize: CatalogPageSize;
    }) => {
      const params = new URLSearchParams();
      const { filters: f, page: p, pageSize: ps } = next;
      if (f.search.trim()) params.set("q", f.search.trim());
      if (f.genres.length) params.set("genres", f.genres.join(","));
      if (f.moods.length) params.set("moods", f.moods.join(","));
      if (f.durationRange) {
        params.set("duration", `${f.durationRange.minSec}-${f.durationRange.maxSec}`);
      }
      if (f.platforms.length) params.set("platforms", f.platforms.join(","));
      if (f.onlyFavorites) params.set("favorites", "true");
      if (f.sort !== DEFAULT_SORT) params.set("sort", f.sort);
      if (p !== 1) params.set("page", String(p));
      if (ps !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(ps));
      setSearchParams(params, { replace: false });
    },
    [setSearchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const nextFilters: CatalogFilters = { ...filters, ...patch };
      // Sort changes preserve current page; everything else resets to page 1.
      const nextPage = patch.sort && Object.keys(patch).length === 1 ? page : 1;
      writeParams({ filters: nextFilters, page: nextPage, pageSize });
    },
    [filters, page, pageSize, writeParams],
  );

  const setPage = useCallback(
    (next: number) => {
      writeParams({ filters, page: Math.max(1, next), pageSize });
    },
    [filters, pageSize, writeParams],
  );

  const setPageSize = useCallback(
    (next: CatalogPageSize) => {
      writeParams({ filters, page: 1, pageSize: next });
    },
    [filters, writeParams],
  );

  const resetFilters = useCallback(() => {
    writeParams({
      filters: {
        search: "",
        genres: [],
        moods: [],
        durationRange: null,
        platforms: [],
        onlyFavorites: false,
        sort: filters.sort,
      },
      page: 1,
      pageSize,
    });
  }, [filters.sort, pageSize, writeParams]);

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.genres.length > 0 ||
    filters.moods.length > 0 ||
    filters.platforms.length > 0 ||
    filters.onlyFavorites ||
    filters.durationRange !== null;

  return {
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    hasActiveFilters,
  };
}
