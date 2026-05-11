import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogStrings } from "@/modules/tracks/strings";

interface FilteredEmptyStateProps {
  onClearFilters: () => void;
}

export function FilteredEmptyState({ onClearFilters }: FilteredEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-metric-subtle/[0.63]"
        aria-hidden="true"
      >
        <Frown className="h-6 w-6 text-metric" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {catalogStrings.states.filteredEmpty.title}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {catalogStrings.states.filteredEmpty.description}
        </p>
      </div>
      <Button size="sm" onClick={onClearFilters}>
        {catalogStrings.states.filteredEmpty.cta}
      </Button>
    </div>
  );
}
