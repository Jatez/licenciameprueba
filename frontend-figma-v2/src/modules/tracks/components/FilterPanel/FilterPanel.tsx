import type { CatalogFilters, CatalogPageResponse } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { catalogStrings } from "@/modules/tracks/strings";
import { FilterSectionGenre } from "./parts/FilterSectionGenre";
import { FilterSectionMood } from "./parts/FilterSectionMood";
import { FilterSectionDuration } from "./parts/FilterSectionDuration";
import { FilterSectionPlatform } from "./parts/FilterSectionPlatform";
import { FilterSectionFavorites } from "./parts/FilterSectionFavorites";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  filters: CatalogFilters;
  data: CatalogPageResponse | undefined;
  isLoading: boolean;
  hasActiveFilters: boolean;
  onPatch: (patch: Partial<CatalogFilters>) => void;
  onClearAll: () => void;
}

export function FilterPanel({
  filters,
  data,
  isLoading,
  hasActiveFilters,
  onPatch,
  onClearAll,
}: FilterPanelProps) {
  return (
    <aside
      aria-label={catalogStrings.filters.title}
      className="flex flex-col gap-1 rounded-card border border-border bg-surface p-4"
    >
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-sm font-semibold text-foreground">{catalogStrings.filters.title}</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearAll}>
            {catalogStrings.filters.clear}
          </Button>
        )}
      </div>

      {isLoading && !data ? (
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <div>
          <FilterSectionGenre
            available={data?.availableGenres ?? []}
            selected={filters.genres}
            onChange={(genres) => onPatch({ genres })}
          />
          <FilterSectionMood
            available={data?.availableMoods ?? []}
            selected={filters.moods}
            onChange={(moods) => onPatch({ moods })}
          />
          <FilterSectionDuration
            value={filters.durationRange}
            onChange={(durationRange) => onPatch({ durationRange })}
          />
          <FilterSectionPlatform
            selected={filters.platforms}
            onChange={(platforms) => onPatch({ platforms })}
          />
          <FilterSectionFavorites
            value={filters.onlyFavorites}
            onChange={(onlyFavorites) => onPatch({ onlyFavorites })}
          />
        </div>
      )}
    </aside>
  );
}
