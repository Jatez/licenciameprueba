import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  onClearFilters: () => void;
}

export function NoResultsEmptyState({ onClearFilters }: Props) {
  const t = licensingStrings.list.empty.noResults;
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button variant="outline" onClick={onClearFilters}>
        {t.cta}
      </Button>
    </div>
  );
}
