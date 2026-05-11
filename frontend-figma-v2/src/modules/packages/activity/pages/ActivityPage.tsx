import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ActivityFilters } from "../components/ActivityFilters";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { activityStrings } from "../strings";
import { useActivityActors, useActivityFeed, type ActivityFilters as ActivityFiltersValue } from "../hooks/useActivityFeed";
import { exportActivityCsv } from "../utils/exportCsv";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_FILTERS: ActivityFiltersValue = {
  from: isoDaysAgo(30),
  to: isoDaysAgo(0),
};

export function ActivityPage() {
  const t = activityStrings;
  const [filters, setFilters] = useState<ActivityFiltersValue>(DEFAULT_FILTERS);

  const feed = useActivityFeed(filters);
  const actorsQuery = useActivityActors();

  const items = useMemo(
    () => feed.data?.pages.flatMap((p) => p.items) ?? [],
    [feed.data],
  );

  const handleExport = () => {
    try {
      exportActivityCsv(items);
      toast.success(t.exportToast.success);
    } catch {
      toast.error(t.exportToast.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard03" className="hover:text-foreground hover:underline">
          {t.breadcrumb.dashboard}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-foreground">{t.breadcrumb.activity}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">{t.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.pageSubtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/activity-history">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              {t.actions.whatIsLogged}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleExport}
            disabled={items.length === 0}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.actions.exportCsv}
          </Button>
        </div>
      </header>

      {/* Body — sidebar + timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <ActivityFilters
            value={filters}
            onChange={setFilters}
            actors={actorsQuery.data ?? []}
          />
        </div>
        <ActivityTimeline
          items={items}
          isLoading={feed.isLoading}
          isFetchingMore={feed.isFetchingNextPage}
          hasNext={Boolean(feed.hasNextPage)}
          onLoadMore={() => feed.fetchNextPage()}
          onClearFilters={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>
    </div>
  );
}