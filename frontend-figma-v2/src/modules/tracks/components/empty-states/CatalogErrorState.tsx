import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogStrings } from "@/modules/tracks/strings";

interface CatalogErrorStateProps {
  onRetry: () => void;
}

export function CatalogErrorState({ onRetry }: CatalogErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-error/15"
        aria-hidden="true"
      >
        <AlertTriangle className="h-6 w-6 text-error" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {catalogStrings.states.error.title}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {catalogStrings.states.error.description}
        </p>
      </div>
      <Button size="sm" onClick={onRetry}>
        {catalogStrings.states.error.cta}
      </Button>
    </div>
  );
}
