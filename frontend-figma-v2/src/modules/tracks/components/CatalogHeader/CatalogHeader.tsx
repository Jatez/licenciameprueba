import { PAGE_HEADER_DESKTOP_PADDING_DEFAULT } from "@/shared/components/layout/AppPageHeader";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  CatalogFilters,
  CatalogPageSize,
  CatalogSortOption,
} from "@/api/types";
import type { CatalogViewMode } from "@/stores/catalogStore";
import { catalogStrings } from "@/modules/tracks/strings";
import { SearchInput } from "./SearchInput";
import { SortDropdown } from "./SortDropdown";
import { PageSizeSelector } from "./PageSizeSelector";
import { ActiveFiltersChips } from "../FilterPanel";

function countActiveFilters(filters: CatalogFilters): number {
  let n = 0;
  if (filters.search.trim()) n += 1;
  n += filters.genres.length;
  n += filters.moods.length;
  n += filters.platforms.length;
  if (filters.durationRange) n += 1;
  if (filters.onlyFavorites) n += 1;
  return n;
}

interface CatalogHeaderProps {
  filters: CatalogFilters;
  pageSize: CatalogPageSize;
  /** Retained for API compatibility — view mode is forced to "list" now. */
  viewMode?: CatalogViewMode;
  onSearchChange: (q: string) => void;
  onSortChange: (s: CatalogSortOption) => void;
  onPageSizeChange: (s: CatalogPageSize) => void;
  /** Retained for API compatibility; the toggle was removed from the UI. */
  onViewModeChange?: (m: CatalogViewMode) => void;
  onPatchFilters: (patch: Partial<CatalogFilters>) => void;
  onClearFilters: () => void;
  onOpenMobileFilters: () => void;
}

export function CatalogHeader({
  filters,
  pageSize,
  onSearchChange,
  onSortChange,
  onPageSizeChange,
  onPatchFilters,
  onClearFilters,
  onOpenMobileFilters,
}: CatalogHeaderProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <header className="flex flex-col gap-2.5">
      <div className={`flex flex-col gap-1.5 ${PAGE_HEADER_DESKTOP_PADDING_DEFAULT}`}>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          {catalogStrings.page.title}
        </h1>
        <p className="text-sm text-muted-foreground">{catalogStrings.page.subtitle}</p>
      </div>

      {/* Search — full width, h-10 to match the filter buttons. */}
      <SearchInput value={filters.search} onChange={onSearchChange} />

      {/* Mobile chip row: filters / sort / page size, scrolls horizontally. */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="h-10 shrink-0 gap-1.5 rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
          onClick={onOpenMobileFilters}
          aria-label={catalogStrings.filters.title}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {catalogStrings.header.filtersButton}
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[11px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
        <SortDropdown value={filters.sort} onChange={onSortChange} />
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} />
      </div>

      {/* Desktop toolbar (≥lg): inline controls, no filters trigger (FilterPanel sidebar visible). */}
      <div className="hidden items-center gap-2 lg:flex">
        <SortDropdown value={filters.sort} onChange={onSortChange} />
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} />
      </div>

      {/* Active filter chips (removable). Hidden when none. */}
      {activeCount > 0 && (
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto scrollbar-hide px-4">
          <ActiveFiltersChips
            filters={filters}
            onPatch={onPatchFilters}
            onClearAll={onClearFilters}
          />
        </div>
      )}
    </header>
  );
}
