import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  LicenseSort,
  ListLicensesFilters,
} from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  filters: ListLicensesFilters;
  hasActiveFilters: boolean;
  onPatch: (patch: Partial<ListLicensesFilters>) => void;
  onClearAll: () => void;
}

type DatePreset = "any" | "today" | "last7" | "last30" | "last90";

function presetToRange(preset: DatePreset): {
  from: string | null;
  to: string | null;
} {
  if (preset === "any") return { from: null, to: null };
  const now = Date.now();
  const days =
    preset === "today" ? 1 : preset === "last7" ? 7 : preset === "last30" ? 30 : 90;
  return {
    from: new Date(now - days * 86400_000).toISOString(),
    to: null,
  };
}

function rangeToPreset(range: ListLicensesFilters["dateRange"]): DatePreset {
  if (!range.from && !range.to) return "any";
  if (!range.from) return "any";
  const fromMs = new Date(range.from).getTime();
  const diffDays = Math.round((Date.now() - fromMs) / 86400_000);
  if (diffDays <= 1) return "today";
  if (diffDays <= 7) return "last7";
  if (diffDays <= 30) return "last30";
  return "last90";
}

const SORT_OPTIONS: LicenseSort[] = [
  "issuedAt-desc",
  "issuedAt-asc",
  "track-asc",
  "creditsConsumed-desc",
  "creditsConsumed-asc",
];

export function LicensesFiltersBar({
  filters,
  hasActiveFilters,
  onPatch,
  onClearAll,
}: Props) {
  const t = licensingStrings.list.filters;
  const [searchInput, setSearchInput] = useState(filters.search);

  // Sync internal input when URL search changes externally (e.g. Clear button).
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Debounce search input → URL state.
  useEffect(() => {
    if (searchInput === filters.search) return;
    const timeout = setTimeout(() => {
      onPatch({ search: searchInput });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const currentPreset = rangeToPreset(filters.dateRange);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label={t.searchAria}
          placeholder={t.search}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-nowrap items-center gap-2">
        <Select
          value={currentPreset}
          onValueChange={(value: DatePreset) =>
            onPatch({ dateRange: presetToRange(value) })
          }
        >
          <SelectTrigger
            className="min-w-[140px] sm:min-w-[160px]"
            aria-label={t.dateRange.label}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t.dateRange.any}</SelectItem>
            <SelectItem value="today">{t.dateRange.today}</SelectItem>
            <SelectItem value="last7">{t.dateRange.last7}</SelectItem>
            <SelectItem value="last30">{t.dateRange.last30}</SelectItem>
            <SelectItem value="last90">{t.dateRange.last90}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(value: LicenseSort) => onPatch({ sort: value })}
        >
          <SelectTrigger
            className="min-w-[140px] sm:min-w-[180px]"
            aria-label={t.sort.label}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {t.sort[opt]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <X className="h-4 w-4" aria-hidden="true" />
            {t.clear}
          </Button>
        )}
      </div>
    </div>
  );
}
