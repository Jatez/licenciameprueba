import { useEffect, useMemo, useRef } from "react";
import { useCatalogUrlState } from "@/modules/tracks/hooks/useCatalogUrlState";
import { useCatalogSearch } from "@/modules/tracks/hooks/useCatalogSearch";
import { useCatalogStore } from "@/stores/catalogStore";
import { catalogStrings } from "@/modules/tracks/strings";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";
import { CatalogHeader } from "../CatalogHeader";
import { FilterPanel, FilterPanelMobileSheet } from "../FilterPanel";
import { ThemedCards } from "../ThemedCards";
import { TrackList, TrackListSkeleton } from "../TrackList";
import { CatalogPagination } from "../CatalogPagination";
import { CatalogEmptyState } from "../empty-states/CatalogEmptyState";
import { NoResultsEmptyState } from "../empty-states/NoResultsEmptyState";
import { FilteredEmptyState } from "../empty-states/FilteredEmptyState";
import { CatalogErrorState } from "../empty-states/CatalogErrorState";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";

export function CatalogPage() {
  const {
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    hasActiveFilters,
  } = useCatalogUrlState();

  const isFiltersOpen = useCatalogStore((s) => s.isFiltersOpen);
  const setFiltersOpen = useCatalogStore((s) => s.setFiltersOpen);
  const viewMode = useCatalogStore((s) => s.viewMode);
  const setViewMode = useCatalogStore((s) => s.setViewMode);

  const themedEnabled = useFeatureFlag("FEATURE_THEMED_CARDS");
  const showThemed = themedEnabled && !hasActiveFilters;

  const { isVisible: isHeaderVisible } = useHeadroom();

  const request = useMemo(() => ({ filters, page, pageSize }), [filters, page, pageSize]);
  const { data, isLoading, isFetching, isError, refetch } = useCatalogSearch(request);

  // Smooth scroll-to-top on page change.
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const tracks = data?.tracks ?? [];

  return (
    <div className="flex flex-col gap-6">
      <a
        href="#catalog-results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-ink-900"
      >
        {catalogStrings.a11y.skipToResults}
      </a>

      <FrostedHeader
        intensity="default"
        translateY={isHeaderVisible ? "0" : "-100%"}
        className="md:-mx-10 md:-mt-12 md:px-10 md:pt-6 md:pb-6"
      >
        <CatalogHeader
          filters={filters}
          pageSize={pageSize}
          viewMode={viewMode}
          onSearchChange={(search) => setFilters({ search })}
          onSortChange={(sort) => setFilters({ sort })}
          onPageSizeChange={setPageSize}
          onViewModeChange={setViewMode}
          onPatchFilters={setFilters}
          onClearFilters={resetFilters}
          onOpenMobileFilters={() => setFiltersOpen(true)}
        />
      </FrostedHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <FilterPanel
              filters={filters}
              data={data}
              isLoading={isLoading}
              hasActiveFilters={hasActiveFilters}
              onPatch={setFilters}
              onClearAll={resetFilters}
            />
          </div>
        </div>

        <FilterPanelMobileSheet
          open={isFiltersOpen}
          onOpenChange={setFiltersOpen}
          filters={filters}
          data={data}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onPatch={setFilters}
          onClearAll={resetFilters}
        />

        <div ref={resultsRef} id="catalog-results" className="flex flex-col gap-6">
          {showThemed && <ThemedCards onApply={(patch) => setFilters(patch)} />}

          {isError ? (
            <CatalogErrorState onRetry={() => refetch()} />
          ) : isLoading && !data ? (
            <TrackListSkeleton variant={viewMode} count={12} />
          ) : tracks.length === 0 ? (
            filters.search.trim() ? (
              <NoResultsEmptyState
                query={filters.search}
                suggestions={data?.suggestedSearches ?? null}
                onClearSearch={() => setFilters({ search: "" })}
                onApplySuggestion={(s) => setFilters({ search: s })}
              />
            ) : hasActiveFilters ? (
              <FilteredEmptyState onClearFilters={resetFilters} />
            ) : (
              <CatalogEmptyState />
            )
          ) : (
            <>
              <TrackList
                tracks={tracks}
                viewMode={viewMode}
                isFetching={isFetching && !isLoading}
              />
              <CatalogPagination
                page={data?.page ?? page}
                totalPages={data?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
