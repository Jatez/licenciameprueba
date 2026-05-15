import { useMemo, useState } from "react";
import { Plus, FileDown, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { LicenseStatusFull, ListLicensesRequest } from "@/api/types";
import { exportsApi } from "@/api/endpoints/exports";
import {
  useLicensesUrlState,
  useListLicenses,
  useCancelLicense,
} from "@/modules/packages/licensing/hooks";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { useLicensingTerms } from "@/modules/packages/licensing/hooks/useLicensingTerms";
import { licensingStrings } from "@/modules/packages/licensing/strings";
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
  const navigate = useNavigate();
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
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const df = filters.dateRange?.from;
      const dt = filters.dateRange?.to;
      await exportsApi.exportLicensesPdf({ dateFrom: df, dateTo: dt });
      toast.success("PDF descargado correctamente");
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Error al exportar PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const df = filters.dateRange?.from;
      const dt = filters.dateRange?.to;
      await exportsApi.exportLicensesCsv({ dateFrom: df, dateTo: dt });
      toast.success("CSV descargado correctamente");
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Error al exportar CSV");
    } finally {
      setExporting(false);
    }
  };

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
  const t = licensingStrings.list;

  return (
    <div className="flex flex-col gap-5">
      <AppPageHeader
        title={t.title}
        description={t.subtitle}
        primaryAction={{
          label: t.newLicenseCta,
          icon: <Plus className="h-4 w-4" aria-hidden="true" />,
          onClick: () => navigate("/catalog"),
        }}
      />
      {/* Export buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleExportPdf}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 rounded-md border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-violet-700 shadow-sm hover:bg-violet-50 disabled:opacity-50 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Exportar PDF
        </button>
        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 rounded-md border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-violet-700 shadow-sm hover:bg-violet-50 disabled:opacity-50 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

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
