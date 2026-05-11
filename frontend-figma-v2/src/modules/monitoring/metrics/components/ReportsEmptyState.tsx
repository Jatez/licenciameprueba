import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";

export interface ReportsEmptyStateProps {
  onCreate: () => void;
}

export function ReportsEmptyState({ onCreate }: ReportsEmptyStateProps) {
  const t = metricsStrings.reportsHistory.empty;
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
      <p className="max-w-md text-sm text-foreground/60">{t.message}</p>
      <Button onClick={onCreate} className="gap-1.5">
        <Plus className="h-4 w-4" aria-hidden="true" />
        {t.cta}
      </Button>
      <Link
        to="/metricas"
        className="mt-2 inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden="true" />
        Volver a métricas
      </Link>
    </div>
  );
}