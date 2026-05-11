import type { CatalogFilters } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { THEMED_PRESETS, type ThemedPreset } from "./themedPresets";
import { ThemedCard } from "./ThemedCard";

interface ThemedCardsProps {
  onApply: (filters: Partial<CatalogFilters>) => void;
}

export function ThemedCards({ onApply }: ThemedCardsProps) {
  return (
    <section aria-labelledby="themed-cards-title" className="space-y-3">
      <h2 id="themed-cards-title" className="text-sm font-semibold text-foreground">
        {catalogStrings.themed.title}
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {THEMED_PRESETS.map((preset: ThemedPreset) => {
          const meta = catalogStrings.themed[preset.id];
          return (
            <li key={preset.id}>
              <ThemedCard
                title={meta.title}
                description={meta.description}
                image={preset.image}
                onClick={() => onApply(preset.filters)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
