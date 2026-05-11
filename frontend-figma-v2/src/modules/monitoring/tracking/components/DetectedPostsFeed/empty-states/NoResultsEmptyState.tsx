import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

export function NoResultsEmptyState() {
  const reset = useTrackingStore((s) => s.resetFilters);
  const t = trackingStrings.monitoring.empty.noResults;
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <SearchX size={32} className="text-muted-foreground" aria-hidden="true" />
      <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{t.message}</p>
      <Button variant="outline" onClick={reset}>
        {t.cta}
      </Button>
    </Card>
  );
}
