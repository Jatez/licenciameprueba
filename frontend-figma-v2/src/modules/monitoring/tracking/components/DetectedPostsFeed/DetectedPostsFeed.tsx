import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTrackingStore } from "@/stores/trackingStore";
import { useDetectedPosts } from "@/modules/monitoring/tracking/hooks";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { PostCard } from "./PostCard";
import { FeedPagination } from "./FeedPagination";
import { NoDetectionsYet } from "./empty-states/NoDetectionsYet";
import { NoResultsEmptyState } from "./empty-states/NoResultsEmptyState";

interface DetectedPostsFeedProps {
  /** Optional callback to surface response data upward (for aggregates). */
  onData?: (data: ReturnType<typeof useDetectedPosts>["data"]) => void;
}

export function DetectedPostsFeed({ onData }: DetectedPostsFeedProps) {
  const filter = useTrackingStore((s) => s.selectedFilter);
  const platforms = useTrackingStore((s) => s.selectedPlatforms);
  const dateRange = useTrackingStore((s) => s.dateRange);
  const page = useTrackingStore((s) => s.currentPage);
  const setPage = useTrackingStore((s) => s.setCurrentPage);

  const query = useDetectedPosts({
    filter,
    platforms,
    dateRange,
    page,
    pageSize: 25,
  });
  const t = trackingStrings.monitoring.error;

  // Surface data to parent (for aggregates KPI strip).
  useEffect(() => {
    if (query.data) onData?.(query.data);
  }, [query.data, onData]);

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-lg" aria-busy="true" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t.title}</AlertTitle>
        <AlertDescription>
          <p className="mb-3">{t.description}</p>
          <Button size="sm" variant="outline" onClick={() => query.refetch()}>
            {t.cta}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const detectedPosts = query.data!;
  if (detectedPosts.posts.length === 0) {
    const hasFilters =
      filter !== "all" || platforms.length > 0;
    return hasFilters ? <NoResultsEmptyState /> : <NoDetectionsYet />;
  }

  return (
    <div className="space-y-3">
      {detectedPosts.posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
      <FeedPagination page={detectedPosts.page} totalPages={detectedPosts.totalPages} onChange={setPage} />
    </div>
  );
}
