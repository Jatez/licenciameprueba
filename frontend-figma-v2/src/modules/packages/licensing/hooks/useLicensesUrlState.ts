import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  LicenseListPageSize,
  LicenseSort,
  LicenseStatusFull,
  ListLicensesFilters,
  LicenseUsageType,
} from "@/api/types";

const DEFAULT_SORT: LicenseSort = "issuedAt-desc";
const DEFAULT_PAGE_SIZE: LicenseListPageSize = 25;
const VALID_SORTS: LicenseSort[] = [
  "issuedAt-desc",
  "issuedAt-asc",
  "track-asc",
  "creditsConsumed-desc",
  "creditsConsumed-asc",
];
const VALID_PAGE_SIZES: LicenseListPageSize[] = [25, 50, 100];
const VALID_STATUSES: LicenseStatusFull[] = [
  "active",
  "consumed",
  "expired",
  "cancelled",
];
const VALID_USAGE_TYPES: LicenseUsageType[] = [
  "single-use",
  "stories-pack",
  "monthly-extended",
  "long-video",
  "paid-post",
  "collaborative-post",
];

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((x) => x.trim()).filter(Boolean);
}

function parseStatuses(raw: string | null): LicenseStatusFull[] {
  return parseList(raw).filter((s): s is LicenseStatusFull =>
    (VALID_STATUSES as string[]).includes(s),
  );
}

function parseUsageTypes(raw: string | null): LicenseUsageType[] {
  return parseList(raw).filter((u): u is LicenseUsageType =>
    (VALID_USAGE_TYPES as string[]).includes(u),
  );
}

function parseSort(raw: string | null): LicenseSort {
  if (raw && (VALID_SORTS as string[]).includes(raw)) return raw as LicenseSort;
  return DEFAULT_SORT;
}

function parsePageSize(raw: string | null): LicenseListPageSize {
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  if ((VALID_PAGE_SIZES as number[]).includes(n)) return n as LicenseListPageSize;
  return DEFAULT_PAGE_SIZE;
}

function parsePage(raw: string | null): number {
  const n = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parseDate(raw: string | null): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export interface LicensesUrlStateApi {
  filters: ListLicensesFilters;
  page: number;
  pageSize: LicenseListPageSize;
  setFilters: (patch: Partial<ListLicensesFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: LicenseListPageSize) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useLicensesUrlState(): LicensesUrlStateApi {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ListLicensesFilters>(
    () => ({
      search: searchParams.get("q") ?? "",
      statuses: parseStatuses(searchParams.get("statuses")),
      usageTypes: parseUsageTypes(searchParams.get("usageTypes")),
      dateRange: {
        from: parseDate(searchParams.get("from")),
        to: parseDate(searchParams.get("to")),
      },
      sort: parseSort(searchParams.get("sort")),
    }),
    [searchParams],
  );

  const page = parsePage(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  const writeParams = useCallback(
    (next: {
      filters: ListLicensesFilters;
      page: number;
      pageSize: LicenseListPageSize;
    }) => {
      const params = new URLSearchParams();
      const { filters: f, page: p, pageSize: ps } = next;
      if (f.search.trim()) params.set("q", f.search.trim());
      if (f.statuses.length) params.set("statuses", f.statuses.join(","));
      if (f.usageTypes.length) params.set("usageTypes", f.usageTypes.join(","));
      if (f.dateRange.from) params.set("from", f.dateRange.from);
      if (f.dateRange.to) params.set("to", f.dateRange.to);
      if (f.sort !== DEFAULT_SORT) params.set("sort", f.sort);
      if (p !== 1) params.set("page", String(p));
      if (ps !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(ps));
      setSearchParams(params, { replace: false });
    },
    [setSearchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<ListLicensesFilters>) => {
      const nextFilters: ListLicensesFilters = { ...filters, ...patch };
      // Sort changes preserve current page; everything else resets to page 1.
      const onlySort = patch.sort && Object.keys(patch).length === 1;
      const nextPage = onlySort ? page : 1;
      writeParams({ filters: nextFilters, page: nextPage, pageSize });
    },
    [filters, page, pageSize, writeParams],
  );

  const setPage = useCallback(
    (next: number) => writeParams({ filters, page: Math.max(1, next), pageSize }),
    [filters, pageSize, writeParams],
  );

  const setPageSize = useCallback(
    (next: LicenseListPageSize) =>
      writeParams({ filters, page: 1, pageSize: next }),
    [filters, writeParams],
  );

  const resetFilters = useCallback(() => {
    writeParams({
      filters: {
        search: "",
        statuses: [],
        usageTypes: [],
        dateRange: { from: null, to: null },
        sort: filters.sort,
      },
      page: 1,
      pageSize,
    });
  }, [filters.sort, pageSize, writeParams]);

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.statuses.length > 0 ||
    filters.usageTypes.length > 0 ||
    filters.dateRange.from !== null ||
    filters.dateRange.to !== null;

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
