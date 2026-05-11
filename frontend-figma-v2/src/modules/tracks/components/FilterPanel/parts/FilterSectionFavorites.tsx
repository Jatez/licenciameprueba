import { Switch } from "@/components/ui/switch";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { catalogStrings } from "@/modules/tracks/strings";
import { FilterSection } from "./FilterSection";

interface FilterSectionFavoritesProps {
  value: boolean;
  onChange: (next: boolean) => void;
}

export function FilterSectionFavorites({ value, onChange }: FilterSectionFavoritesProps) {
  const enabled = useFeatureFlag("FEATURE_FAVORITES");
  if (!enabled) return null;
  return (
    <FilterSection title={catalogStrings.filters.sections.favorites}>
      <label className="flex cursor-pointer items-center justify-between gap-2 py-1 text-sm">
        <span className="text-foreground">{catalogStrings.filters.favorites.onlyMine}</span>
        <Switch checked={value} onCheckedChange={onChange} />
      </label>
    </FilterSection>
  );
}
