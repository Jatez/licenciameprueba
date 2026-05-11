import { useMemo } from "react";
import type { LicenseStatusFull, ListLicensesRequest } from "@/api/types";
import {
  useLicensesUrlState,
  useListLicenses,
  useCancelLicense,
} from "@/modules/packages/licensing/hooks";
import { useLicensingTerms } from "@/modules/packages/licensing/hooks/useLicensingTerms";
import { LicensesHeader } from "./LicensesHeader";
import { LicensesAggregateStats } from "./LicensesAggregateStats";
import { LicensesFiltersBar } from "./LicensesFiltersBar";
import { LicensesTable, LicensesTableSkeleton } from "./LicensesTable";
import { LicensesPagination } from "./LicensesPagination";
import { NoLicensesEmptyState } from "./empty-states/NoLicensesEmptyState";
import { NoResultsEmptyState } from "./empty-states/NoResultsEmptyState";
import { LicensesErrorState } from "./empty-states/LicensesErrorState";
import { CancellationDialog } from "../CancellationDialog";
import { useState } from "react";
import type { License } from "@/api/types";

export function LicensesListPage() {
  const {
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    hasActiveFilters,
  } = useLicensesUrlState();

  const request = useMemo<ListLicensesRequest>(
    () => ({ filters, page, pageSize }),
    [filters, page, pageSize],
  );
  const { data, isLoading, isFetching, isError, refetch } =
    useListLicenses(request);
  const terms = useLicensingTerms();
  const cancelMutation = useCancelLicense();

  const [cancelTarget, setCancelTarget] = useState<License | null>(null);

  const toggleStatus = (status: LicenseStatusFull) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    setFilters({ statuses: next });
  };

  const licenses = data?.licenses ?? [];
  const totalLicenses = data?.aggregates
    ? data.aggregates.totalActive +
      data.aggregates.totalConsumed +
      data.aggregates.totalExpired +
      data.aggregates.totalCancelled
    : 0;
  const showEmptyAll =
    !isLoading && licenses.length === 0 && !hasActiveFilters && totalLicenses === 0;
  const showNoResults =
    !isLoading &&
    licenses.length === 0 &&
    (hasActiveFilters || totalLicenses > 0);

  return (
    <div className="flex flex-col gap-6">
      <LicensesHeader />

      {isError ? (
        <LicensesErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <LicensesAggregateStats
            aggregates={data?.aggregates}
            isLoading={isLoading && !data}
            activeStatuses={filters.statuses}
            onToggleStatus={toggleStatus}
          />

          <LicensesFiltersBar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onPatch={setFilters}
            onClearAll={resetFilters}
          />

          {isLoading && !data ? (
            <LicensesTableSkeleton />
          ) : showEmptyAll ? (
            <NoLicensesEmptyState />
          ) : showNoResults ? (
            <NoResultsEmptyState onClearFilters={resetFilters} />
          ) : (
            <>
              <LicensesTable
                licenses={licenses}
                terms={terms.data}
                isFetching={isFetching && !isLoading}
                onCancel={(l) => setCancelTarget(l)}
              />
              <LicensesPagination
                page={data?.page ?? page}
                totalPages={data?.totalPages ?? 1}
                pageSize={data?.pageSize ?? pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </>
      )}

      <CancellationDialog
        license={cancelTarget}
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        cancelMutation={cancelMutation}
      />
    </div>
  );
}
