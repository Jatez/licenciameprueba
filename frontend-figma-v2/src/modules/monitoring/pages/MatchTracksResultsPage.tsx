import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlternativeTracksDrawer,
  BulkMatchActions,
  LicenseTrackModal,
  LowMatchRateBanner,
  MatchCriteriaExplainer,
  MatchResultsTable,
  PartialMatchDrawer,
  ResultsFilters,
  initialFilters,
  matchTracksStrings as s,
  unifiedMatchRows,
} from "@/modules/monitoring/match-tracks";
import type {
  ResultsFiltersValue,
  UnifiedMatchRow,
  UnifiedSource,
} from "@/modules/monitoring/match-tracks";

const LOW_MATCH_THRESHOLD = 50;

function applyFilters(rows: UnifiedMatchRow[], f: ResultsFiltersValue) {
  return rows.filter((r) => {
    if (f.source !== "all" && r.source !== f.source) return false;
    if (f.matchStatus !== "all") {
      if (f.matchStatus === "legal_review" && r.matchType !== "legal_review") return false;
      if (
        f.matchStatus !== "legal_review" &&
        r.status !== f.matchStatus
      )
        return false;
    }
    if (f.licenseStatus !== "all" && r.licenseStatus !== f.licenseStatus) return false;
    if (r.confidence < f.minConfidence) return false;
    if (r.credits != null && r.credits > f.maxCredits) return false;
    return true;
  });
}

export default function MatchTracksResults() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sourceParam = params.get("source") as UnifiedSource | null;

  const [filters, setFilters] = useState<ResultsFiltersValue>({
    ...initialFilters,
    source: sourceParam ?? "all",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [partialRow, setPartialRow] = useState<UnifiedMatchRow | null>(null);
  const [licenseRow, setLicenseRow] = useState<UnifiedMatchRow | null>(null);
  const [alternativesRow, setAlternativesRow] = useState<UnifiedMatchRow | null>(null);

  const rows = useMemo(() => applyFilters(unifiedMatchRows, filters), [filters]);

  const sourceScope = useMemo(
    () =>
      filters.source === "all"
        ? unifiedMatchRows
        : unifiedMatchRows.filter((r) => r.source === filters.source),
    [filters.source],
  );
  const matchRate = useMemo(() => {
    if (sourceScope.length === 0) return 0;
    const matched = sourceScope.filter(
      (r) => r.status === "matched" || r.status === "already_licensed",
    ).length;
    return Math.round((matched / sourceScope.length) * 100);
  }, [sourceScope]);
  const isLow = matchRate < LOW_MATCH_THRESHOLD;

  const selectedRows = unifiedMatchRows.filter((r) => selectedIds.includes(r.id));
  const hasNonLicensable = selectedRows.some((r) => r.status !== "matched");

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function toggleAll(checked: boolean) {
    const licensable = rows.filter((r) => r.status === "matched").map((r) => r.id);
    setSelectedIds(checked ? Array.from(new Set([...selectedIds, ...licensable])) : []);
  }

  function handleAction(row: UnifiedMatchRow) {
    switch (row.status) {
      case "matched":
        setLicenseRow(row);
        break;
      case "partial":
        setPartialRow(row);
        break;
      case "not_available":
        setAlternativesRow(row);
        break;
      case "already_licensed":
        toast(s.results.statusCopy.already_licensed.body);
        break;
    }
  }

  function confirmLicense(row: UnifiedMatchRow) {
    setLicenseRow(null);
    setPartialRow(null);
    toast.success(s.results.licenseModal.toast, {
      description: `${row.externalTitle} · ${row.externalArtist}`,
    });
  }

  function bulkLicense() {
    const n = selectedRows.length;
    if (n === 0) return;
    toast.success(s.results.bulk.bulkLicensedToast(n));
    setSelectedIds([]);
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/match-tracks")}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
      </Button>

      <header className="mb-6 max-w-3xl">
        <h1 className="text-2xl font-semibold text-foreground">{s.results.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{s.results.subtitle}</p>
      </header>

      <section className="mb-6">
        <MatchCriteriaExplainer />
      </section>

      {isLow && (
        <section className="mb-6">
          <LowMatchRateBanner
            matchRate={matchRate}
            onViewMissing={() =>
              setFilters((f) => ({ ...f, matchStatus: "not_available" }))
            }
          />
        </section>
      )}

      <section className="mb-4">
        <ResultsFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters({ ...initialFilters, source: sourceParam ?? "all" })}
        />
      </section>

      <BulkMatchActions
        selectedCount={selectedRows.length}
        hasNonLicensable={hasNonLicensable}
        onLicense={bulkLicense}
        onExport={() => toast(s.results.bulk.exportToast)}
        onAlternatives={() => alternativesRow ?? setAlternativesRow(selectedRows[0] ?? null)}
        onClear={() => setSelectedIds([])}
      />

      <section className="mt-4">
        <MatchResultsTable
          rows={rows}
          selectedIds={selectedIds}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onAction={handleAction}
        />
      </section>

      <PartialMatchDrawer
        row={partialRow}
        onClose={() => setPartialRow(null)}
        onConfirm={confirmLicense}
        onFindOther={(row) => {
          setPartialRow(null);
          setAlternativesRow(row);
        }}
        onMarkUnavailable={(row) => {
          setPartialRow(null);
          toast(`${row.externalTitle} marcada como no disponible (demo).`);
        }}
      />

      <LicenseTrackModal
        row={licenseRow}
        onClose={() => setLicenseRow(null)}
        onConfirm={confirmLicense}
      />

      <AlternativeTracksDrawer
        row={alternativesRow}
        onClose={() => setAlternativesRow(null)}
        onLicense={(alt) => {
          setAlternativesRow(null);
          toast.success(s.results.licenseModal.toast, {
            description: `${alt.title} · ${alt.artist}`,
          });
        }}
      />
    </>
  );
}
