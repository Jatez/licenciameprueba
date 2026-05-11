import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogStrings } from "@/modules/tracks/strings";
import { interpolate } from "@/modules/tracks/utils";

interface NoResultsEmptyStateProps {
  query: string;
  suggestions: string[] | null;
  onClearSearch: () => void;
  onApplySuggestion: (suggestion: string) => void;
}

export function NoResultsEmptyState({
  query,
  suggestions,
  onClearSearch,
  onApplySuggestion,
}: NoResultsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-metric-subtle/[0.63]"
        aria-hidden="true"
      >
        <SearchX className="h-6 w-6 text-metric" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {interpolate(catalogStrings.search.noResults.title, { query })}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {catalogStrings.search.noResults.description}
        </p>
      </div>
      {suggestions && suggestions.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((s) => (
            <li key={s}>
              <Button variant="outline" size="sm" onClick={() => onApplySuggestion(s)}>
                {s}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button variant="ghost" size="sm" onClick={onClearSearch}>
        {catalogStrings.search.clear}
      </Button>
    </div>
  );
}
