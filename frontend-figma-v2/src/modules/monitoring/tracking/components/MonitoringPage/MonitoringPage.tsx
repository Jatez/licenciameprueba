import { useState } from "react";
import { useTrackingStore } from "@/stores/trackingStore";
import { useDetectedPosts } from "@/modules/monitoring/tracking/hooks";
import type { ListDetectedPostsResponse } from "@/api/types";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { SyncStatusBanner } from "../SyncStatusBanner";
import { FeedAggregates } from "../FeedAggregates";
import { FeedToolbar } from "../FeedToolbar";
import { DetectedPostsFeed } from "../DetectedPostsFeed";
import { ManualLinkDialog } from "../ManualLinkDialog";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

/**
 * Orchestrates the /monitoring page. Shares the feed query with
 * `FeedAggregates` so they always reflect the same response.
 */
export function MonitoringPage() {
  const t = trackingStrings.monitoring;
  const filter = useTrackingStore((s) => s.selectedFilter);
  const platforms = useTrackingStore((s) => s.selectedPlatforms);
  const dateRange = useTrackingStore((s) => s.dateRange);
  const page = useTrackingStore((s) => s.currentPage);

  const aggregatesQuery = useDetectedPosts({
    filter,
    platforms,
    dateRange,
    page,
    pageSize: 25,
  });

  const [_, setData] = useState<ListDetectedPostsResponse | undefined>();

  return (
    <div className="w-full space-y-4">
      <AppPageHeader title={t.title} description={t.subtitle} />
      <SyncStatusBanner />
      <FeedAggregates data={aggregatesQuery.data} isLoading={aggregatesQuery.isLoading} />
      <FeedToolbar />
      <DetectedPostsFeed onData={setData} />
      <ManualLinkDialog />
    </div>
  );
}
