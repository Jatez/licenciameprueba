/**
 * F-11 · Metrics overview page (route: /metricas).
 *
 * Owns local state for filter + pagination + top-tracks sort. Wires hooks
 * to the layout components defined in features/metrics/components.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";
import {
  useCreditsByType,
  useMetricsOverview,
  usePublicationsList,
  useTopTracks,
} from "@/modules/monitoring/metrics/hooks";
import { MetricsHeader } from "@/modules/monitoring/metrics/components/MetricsHeader";
import { MetricsFilterBar } from "@/modules/monitoring/metrics/components/MetricsFilterBar";
import { DataHealthBanner } from "@/modules/monitoring/metrics/components/DataHealthBanner";
import { KpiGrid } from "@/modules/monitoring/metrics/components/KpiGrid";
import { TrendChart } from "@/modules/monitoring/metrics/components/TrendChart";
import { PlatformDistribution } from "@/modules/monitoring/metrics/components/PlatformDistribution";
import { PublicationsTable } from "@/modules/monitoring/metrics/components/PublicationsTable";
import { TopTracksSection } from "@/modules/monitoring/metrics/components/TopTracksSection";
import { ExportDrawer } from "@/modules/monitoring/metrics/components/export/ExportDrawer";
import { defaultFilter } from "@/modules/monitoring/metrics/utils";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";
import { getActiveScenario } from "@/modules/monitoring/metrics/mocks";
import type { MetricsFilter } from "@/modules/monitoring/metrics/types";
import type { TopTrackSortKey } from "@/modules/monitoring/metrics/selectors/computeTopTracks";

const MetricsOverviewPage = () => {
  const [filter, setFilter] = useState<MetricsFilter>(defaultFilter);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [exportOpen, setExportOpen] = useState(false);
  const [topTracksSort, setTopTracksSort] = useState<TopTrackSortKey>("views");
  const filterBarRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const { isVisible: isHeaderVisible } = useHeadroom();

  // Reset page on any filter change.
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const overviewQ = useMetricsOverview(filter);
  const tableQ = usePublicationsList(filter, page, pageSize);
  // Current period top tracks (limit 12 for the rich section).
  const topQ = useTopTracks(filter, 12, topTracksSort);
  // Previous-period ranking — same filter except trackId, used to compute deltas.
  const prevFilter = useMemo<MetricsFilter>(
    () => ({ ...filter, trackId: null }),
    [filter],
  );
  const prevTopQ = useTopTracks(prevFilter, 12, topTracksSort);
  // Kept warm so the future top-tracks section + export feel instant.
  useCreditsByType(filter);

  const scenario = getActiveScenario();
  const isSparse = scenario === "sparse";
  const isPartialScenario = scenario === "partial";

  const partialCount = overviewQ.data?.dataHealth.totalPartial ?? 0;

  const partialNote = useMemo(() => {
    if (!isPartialScenario || !overviewQ.data) return null;
    const { totalSynced, totalExpected } = overviewQ.data.dataHealth;
    return { synced: totalSynced, total: totalExpected };
  }, [isPartialScenario, overviewQ.data]);

  const handleRefresh = () => {
    overviewQ.refetch();
    tableQ.refetch();
    topQ.refetch();
  };

  const handleSeeIssues = () => {
    setFilter({ ...filter, syncStatusFilter: "with_issues" });
  };

  const handleEditFilters = () => {
    filterBarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSelectTrack = (trackId: string, _title: string) => {
    if (trackId === "__clear__") {
      setFilter({ ...filter, trackId: null });
      return;
    }
    if (filter.trackId === trackId) {
      setFilter({ ...filter, trackId: null });
    } else {
      setFilter({ ...filter, trackId });
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const emptyAction = (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setFilter({ ...defaultFilter, period: "last_90_days" })}
      >
        {metricsStrings.table.empty.changePeriod}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.info(metricsStrings.table.empty.tutorialToast)}
      >
        {metricsStrings.table.empty.tutorial}
      </Button>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <FrostedHeader
        intensity="default"
        translateY={isHeaderVisible ? "0" : "-100%"}
        className="-mx-mobile-gutter px-mobile-gutter md:-mx-10 md:-mt-12 md:px-10 md:pt-6 md:pb-6"
      >
        <MetricsHeader
          lastSyncAt={overviewQ.data?.dataHealth.lastGlobalSyncAt ?? null}
          isRefreshing={overviewQ.isLoading || tableQ.isLoading}
          onRefresh={handleRefresh}
          onExport={() => setExportOpen(true)}
        />
      </FrostedHeader>

      <div ref={filterBarRef}>
        <MetricsFilterBar filter={filter} onChange={setFilter} />
      </div>

      {overviewQ.data && (
        <DataHealthBanner
          health={overviewQ.data.dataHealth}
          onSyncNow={handleRefresh}
          onSeeIssues={handleSeeIssues}
        />
      )}

      <KpiGrid
        overview={overviewQ.data ?? null}
        isLoading={overviewQ.isLoading && !overviewQ.data}
        partialNote={partialNote}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart
            publications={tableQ.data?.publications ?? []}
            filter={filter}
            isLoading={tableQ.isLoading && !tableQ.data}
            isSparse={isSparse}
          />
        </div>
        <PlatformDistribution
          overview={overviewQ.data ?? null}
          isLoading={overviewQ.isLoading && !overviewQ.data}
        />
      </div>

      <div ref={tableRef}>
        <PublicationsTable
          publications={tableQ.data?.publications ?? []}
          total={tableQ.data?.total ?? 0}
          page={tableQ.data?.page ?? page}
          pageSize={tableQ.data?.pageSize ?? pageSize}
          totalPages={tableQ.data?.totalPages ?? 1}
          isLoading={tableQ.isLoading && !tableQ.data}
          isFetching={tableQ.isLoading && !!tableQ.data}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          emptyAction={emptyAction}
        />
      </div>

      <TopTracksSection
        tracks={topQ.data}
        previousTracks={prevTopQ.data}
        isLoading={topQ.isLoading && !topQ.data}
        sortKey={topTracksSort}
        onSortChange={setTopTracksSort}
        activeTrackId={filter.trackId}
        onSelectTrack={handleSelectTrack}
      />

      <ExportDrawer
        open={exportOpen}
        onOpenChange={setExportOpen}
        filter={filter}
        partialCount={
          filter.syncStatusFilter !== "with_issues" ? partialCount : 0
        }
        onEditFilters={handleEditFilters}
      />
    </div>
  );
};

export default MetricsOverviewPage;
