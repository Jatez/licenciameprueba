import { Skeleton } from "@/components/ui/skeleton";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import type {
  ListDetectedPostsResponse,
  TrackingFeedFilter,
} from "@/api/types";

interface FeedAggregatesProps {
  data: ListDetectedPostsResponse | undefined;
  isLoading: boolean;
}

interface AggregateCardSpec {
  filter: TrackingFeedFilter;
  label: string;
  count: number;
  accent: string;
}

export function FeedAggregates({ data, isLoading }: FeedAggregatesProps) {
  const selectedFilter = useTrackingStore((s) => s.selectedFilter);
  const setFilter = useTrackingStore((s) => s.setFilter);
  const t = trackingStrings.monitoring.aggregates;

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" aria-busy="true" />
        ))}
      </div>
    );
  }

  const a = data.aggregates;
  const total =
    a.pendingMatch + a.matchedAuto + a.matchedManual + a.noMatchFound + a.unlinked;

  const cards: AggregateCardSpec[] = [
    { filter: "all", label: t.all, count: total, accent: "border-border" },
    {
      filter: "pending-match",
      label: t.pendingMatch,
      count: a.pendingMatch,
      accent: "border-lm-gray-300",
    },
    {
      filter: "matched-auto",
      label: t.matchedAuto,
      count: a.matchedAuto,
      accent: "border-success/50",
    },
    {
      filter: "matched-manual",
      label: t.matchedManual,
      count: a.matchedManual,
      accent: "border-info/50",
    },
    {
      filter: "no-match-found",
      label: t.noMatchFound,
      count: a.noMatchFound,
      accent: "border-warning/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {cards.map((card) => {
        const isActive = selectedFilter === card.filter;
        return (
          <button
            key={card.filter}
            type="button"
            aria-pressed={isActive}
            onClick={() => setFilter(card.filter)}
            className={`flex flex-col items-start rounded-lg border-2 bg-background p-3 text-left transition-colors hover:bg-foreground/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive ? "border-foreground bg-foreground/[0.04]" : card.accent
            }`}
          >
            <span className="text-2xl font-semibold text-foreground">
              {card.count}
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              {card.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
