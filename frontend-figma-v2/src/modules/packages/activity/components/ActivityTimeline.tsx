import { useEffect, useMemo, useRef } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { UserActivityItem } from "@/shared/components/activity/UserActivityItem";
import type { UserActivity } from "@/api/types.dashboard";
import { activityStrings } from "../strings";
import { groupActivityByDay } from "../utils/groupByDay";

interface ActivityTimelineProps {
  items: UserActivity[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
  onClearFilters: () => void;
}

function formatCount(n: number): string {
  const tpl = n === 1 ? activityStrings.feed.countSingular : activityStrings.feed.countPlural;
  return tpl.replace("{count}", String(n));
}

export function ActivityTimeline({
  items,
  isLoading,
  isFetchingMore,
  hasNext,
  onLoadMore,
  onClearFilters,
}: ActivityTimelineProps) {
  const groups = useMemo(() => groupActivityByDay(items), [items]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNext || isFetchingMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNext, isFetchingMore, onLoadMore]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyStateCard
        icon={Inbox}
        title={activityStrings.empty.title}
        description={activityStrings.empty.description}
        ctaLabel={activityStrings.empty.cta}
        onCtaClick={onClearFilters}
        className="border border-border bg-card"
      />
    );
  }

  return (
    <div
      role="feed"
      aria-label={activityStrings.feed.ariaLabel}
      aria-busy={isFetchingMore}
      className="flex flex-col gap-6"
    >
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-1">
          <header className="sticky top-0 z-10 -mx-1 flex items-baseline justify-between rounded-md bg-card/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <h3 className="text-sm font-semibold capitalize text-foreground">{group.label}</h3>
            <span className="text-[11px] text-muted-foreground font-tnum">
              {formatCount(group.items.length)}
            </span>
          </header>
          <ul className="flex flex-col rounded-card border border-border bg-card p-2">
            {group.items.map((item) => (
              <UserActivityItem key={item.id} item={item} showActor expandable />
            ))}
          </ul>
        </section>
      ))}

      <div ref={sentinelRef} className="flex items-center justify-center py-4">
        {hasNext ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className="gap-2"
          >
            {isFetchingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isFetchingMore ? activityStrings.feed.loadingMore : activityStrings.feed.loadMore}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">{activityStrings.feed.end}</span>
        )}
      </div>
    </div>
  );
}