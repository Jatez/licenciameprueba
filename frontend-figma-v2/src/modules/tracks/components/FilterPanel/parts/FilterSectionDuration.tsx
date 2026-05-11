import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { DurationRange } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { formatDuration, interpolate } from "@/modules/tracks/utils";
import { FilterSection } from "./FilterSection";

const MIN = 0;
const MAX = 600;
const STEP = 5;

interface FilterSectionDurationProps {
  value: DurationRange | null;
  onChange: (next: DurationRange | null) => void;
}

export function FilterSectionDuration({ value, onChange }: FilterSectionDurationProps) {
  const [local, setLocal] = useState<[number, number]>([
    value?.minSec ?? MIN,
    value?.maxSec ?? MAX,
  ]);

  useEffect(() => {
    setLocal([value?.minSec ?? MIN, value?.maxSec ?? MAX]);
  }, [value]);

  const commit = (next: number[]) => {
    const [min, max] = next as [number, number];
    if (min === MIN && max === MAX) onChange(null);
    else onChange({ minSec: min, maxSec: max });
  };

  return (
    <FilterSection title={catalogStrings.filters.sections.duration}>
      <div className="space-y-3 pt-1">
        <Slider
          value={local}
          min={MIN}
          max={MAX}
          step={STEP}
          minStepsBetweenThumbs={1}
          onValueChange={(v) => setLocal(v as [number, number])}
          onValueCommit={commit}
          aria-label={catalogStrings.filters.duration.label}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {interpolate(catalogStrings.filters.duration.minToMax, {
              min: formatDuration(local[0]),
              max: formatDuration(local[1]),
            })}
          </span>
          {value !== null && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onChange(null)}
            >
              {catalogStrings.filters.duration.any}
            </Button>
          )}
        </div>
      </div>
    </FilterSection>
  );
}
