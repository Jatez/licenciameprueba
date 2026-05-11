import { useCallback, useMemo, useState } from "react";
import { adminLicensesMocks } from "../mocks";
import { LICENSES_DEFAULT_FILTERS, type AdminLicense, type LicensesFiltersState } from "../types";

const DAY = 86_400_000;
const RANGE_MS: Record<LicensesFiltersState["range"], number | null> = {
  "7d": 7 * DAY,
  "30d": 30 * DAY,
  "90d": 90 * DAY,
  all: null,
};

export function useAdminLicenses() {
  const [licenses] = useState<AdminLicense[]>(adminLicensesMocks);
  const [filters, setFilters] = useState<LicensesFiltersState>(LICENSES_DEFAULT_FILTERS);

  const resetFilters = useCallback(() => setFilters(LICENSES_DEFAULT_FILTERS), []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const rangeMs = RANGE_MS[filters.range];
    const minTs = rangeMs ? Date.now() - rangeMs : 0;
    return licenses.filter((l) => {
      if (filters.status !== "all" && l.status !== filters.status) return false;
      if (filters.usageType !== "all" && l.usageType !== filters.usageType) return false;
      if (filters.company !== "all" && l.companyName !== filters.company) return false;
      if (filters.onlyHiddenTracks && !(l.trackHidden && l.status === "active")) return false;
      if (rangeMs && new Date(l.issuedAt).getTime() < minTs) return false;
      if (q) {
        const blob =
          `${l.tokenId} ${l.trackTitle} ${l.trackArtist} ${l.trackIsrc} ${l.companyName}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [licenses, filters]);

  const stats = useMemo(() => {
    const monthAgo = Date.now() - 30 * DAY;
    return {
      active: licenses.filter((l) => l.status === "active").length,
      issued30d: licenses.filter((l) => new Date(l.issuedAt).getTime() >= monthAgo).length,
      expired: licenses.filter((l) => l.status === "expired").length,
      disputed: licenses.filter((l) => l.status === "disputed").length,
    };
  }, [licenses]);

  return { licenses, filtered, filters, setFilters, resetFilters, stats };
}
