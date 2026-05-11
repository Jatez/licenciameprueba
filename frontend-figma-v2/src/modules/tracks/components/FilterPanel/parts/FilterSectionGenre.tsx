import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Genre } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { FilterSection } from "./FilterSection";

interface FilterSectionGenreProps {
  available: Array<{ genre: Genre; count: number }>;
  selected: Genre[];
  onChange: (next: Genre[]) => void;
}

export function FilterSectionGenre({ available, selected, onChange }: FilterSectionGenreProps) {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? available : available.slice(0, 10);

  const toggle = (g: Genre) => {
    onChange(selected.includes(g) ? selected.filter((x) => x !== g) : [...selected, g]);
  };

  return (
    <FilterSection title={catalogStrings.filters.sections.genre} defaultOpen>
      <fieldset className="space-y-2">
        <legend className="sr-only">{catalogStrings.filters.sections.genre}</legend>
        {list.length === 0 && (
          <p className="text-xs text-muted-foreground">Sin opciones disponibles</p>
        )}
        {list.map(({ genre, count }) => {
          const id = `genre-${genre}`;
          const label =
            catalogStrings.genres[genre as keyof typeof catalogStrings.genres] ?? genre;
          return (
            <label
              key={genre}
              htmlFor={id}
              className="flex cursor-pointer items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={selected.includes(genre)}
                  onCheckedChange={() => toggle(genre)}
                />
                <span className="text-foreground">{label}</span>
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
