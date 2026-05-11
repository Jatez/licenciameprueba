import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import type { Mood } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { FilterSection } from "./FilterSection";

interface FilterSectionMoodProps {
  available: Array<{ mood: Mood; count: number }>;
  selected: Mood[];
  onChange: (next: Mood[]) => void;
}

export function FilterSectionMood({ available, selected, onChange }: FilterSectionMoodProps) {
  const enabled = useFeatureFlag("FEATURE_MOOD_FILTER");
  const [showAll, setShowAll] = useState(false);

  if (!enabled || available.length === 0) return null;

  const list = showAll ? available : available.slice(0, 10);
  const toggle = (m: Mood) => {
    onChange(selected.includes(m) ? selected.filter((x) => x !== m) : [...selected, m]);
  };

  return (
    <FilterSection title={catalogStrings.filters.sections.mood}>
      <fieldset className="space-y-2">
        <legend className="sr-only">{catalogStrings.filters.sections.mood}</legend>
        {list.map(({ mood, count }) => {
          const id = `mood-${mood}`;
          return (
            <label
              key={mood}
              htmlFor={id}
              className="flex cursor-pointer items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={selected.includes(mood)}
                  onCheckedChange={() => toggle(mood)}
                />
                <span className="capitalize text-foreground">{mood}</span>
              </span>
              <span className="text-xs text-muted-foreground">{count.toLocaleString("es")}</span>
            </label>
          );
        })}
        {available.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? catalogStrings.filters.genres.viewLess : catalogStrings.filters.genres.viewMore}
          </Button>
        )}
      </fieldset>
    </FilterSection>
  );
}
