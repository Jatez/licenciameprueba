import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CatalogFilters } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { formatDuration, interpolate } from "@/modules/tracks/utils";

interface ActiveFiltersChipsProps {
  filters: CatalogFilters;
  onPatch: (patch: Partial<CatalogFilters>) => void;
  onClearAll: () => void;
}

interface Chip {
  key: string;
  label: string;
  remove: () => void;
}

export function ActiveFiltersChips({ filters, onPatch, onClearAll }: ActiveFiltersChipsProps) {
  const chips: Chip[] = [];

  if (filters.search.trim()) {
    chips.push({
      key: "search",
      label: interpolate(catalogStrings.filters.activeChips.search, { value: filters.search }),
      remove: () => onPatch({ search: "" }),
    });
  }
  for (const g of filters.genres) {
    const label =
      catalogStrings.genres[g as keyof typeof catalogStrings.genres] ?? g;
    chips.push({
      key: `g-${g}`,
      label: interpolate(catalogStrings.filters.activeChips.genre, { value: label }),
      remove: () => onPatch({ genres: filters.genres.filter((x) => x !== g) }),
    });
  }
  for (const m of filters.moods) {
    chips.push({
      key: `m-${m}`,
      label: interpolate(catalogStrings.filters.activeChips.mood, { value: m }),
      remove: () => onPatch({ moods: filters.moods.filter((x) => x !== m) }),
    });
  }
  for (const p of filters.platforms) {
    const label = catalogStrings.filters.platform[p];
    chips.push({
      key: `p-${p}`,
      label: interpolate(catalogStrings.filters.activeChips.platform, { value: label }),
      remove: () => onPatch({ platforms: filters.platforms.filter((x) => x !== p) }),
    });
  }
  if (filters.durationRange) {
    chips.push({
      key: "duration",
      label: interpolate(catalogStrings.filters.activeChips.duration, {
        min: formatDuration(filters.durationRange.minSec),
        max: formatDuration(filters.durationRange.maxSec),
      }),
      remove: () => onPatch({ durationRange: null }),
    });
  }
  if (filters.onlyFavorites) {
    chips.push({
      key: "favorites",
      label: catalogStrings.filters.activeChips.favorites,
      remove: () => onPatch({ onlyFavorites: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={catalogStrings.a11y.activeFilters}
    >
      {chips.map((c) => (
        <Badge
          key={c.key}
          variant="secondary"
          className="flex items-center gap-1 rounded-full pl-3 pr-1 py-0.5"
        >
          <span className="text-xs">{c.label}</span>
          <button
            type="button"
            onClick={c.remove}
            aria-label={interpolate(catalogStrings.filters.activeChips.removeOne, {
              label: c.label,
            })}
            className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearAll}>
        {catalogStrings.filters.activeChips.clearAll}
      </Button>
    </div>
  );
}
