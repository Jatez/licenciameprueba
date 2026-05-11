import { Checkbox } from "@/components/ui/checkbox";
import { PlatformBadge } from "@/components/ui/platform-badge";
import type { LicensablePlatform } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { FilterSection } from "./FilterSection";

const OPTIONS: Array<{ value: LicensablePlatform; labelKey: keyof typeof catalogStrings.filters.platform }> = [
  { value: "instagram", labelKey: "instagram" },
  { value: "tiktok", labelKey: "tiktok" },
  { value: "facebook", labelKey: "facebook" },
];

interface FilterSectionPlatformProps {
  selected: LicensablePlatform[];
  onChange: (next: LicensablePlatform[]) => void;
}

export function FilterSectionPlatform({ selected, onChange }: FilterSectionPlatformProps) {
  const toggle = (p: LicensablePlatform) => {
    onChange(selected.includes(p) ? selected.filter((x) => x !== p) : [...selected, p]);
  };
  return (
    <FilterSection title={catalogStrings.filters.sections.platform}>
      <fieldset className="space-y-2">
        <legend className="sr-only">{catalogStrings.filters.sections.platform}</legend>
        {OPTIONS.map(({ value, labelKey }) => {
          const id = `platform-${value}`;
          return (
            <label
              key={value}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                id={id}
                checked={selected.includes(value)}
                onCheckedChange={() => toggle(value)}
              />
              <PlatformBadge platform={value} size="xs" />
              <span className="text-foreground">{catalogStrings.filters.platform[labelKey]}</span>
            </label>
          );
        })}
      </fieldset>
    </FilterSection>
  );
}
