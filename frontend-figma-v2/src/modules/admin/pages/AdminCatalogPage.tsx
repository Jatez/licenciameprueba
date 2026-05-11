import { useState } from "react";
import { toast } from "sonner";
import { adminCatalogStats } from "@/modules/admin/catalog";
import {
  CatalogHeader,
  CatalogStats,
  CatalogFilters,
  CatalogTable,
  TrackDetailSheet,
  TrackFormDialog,
  HideTrackDialog,
  ImportCsvDialog,
  OperationalNote,
  catalogStrings,
  useAdminCatalog,
  type AdminTrack,
} from "@/modules/admin/catalog";

/**
 * F-09 · /admin/catalog
 * 100% UI demo — no backend, no real upload, no persistence.
 */
export default function AdminCatalog() {
  const { filtered, filters, setFilters, resetFilters, hideTrack, restoreTrack, upsertTrack } =
    useAdminCatalog();

  const [detail, setDetail] = useState<AdminTrack | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminTrack | null>(null);
  const [hideTarget, setHideTarget] = useState<AdminTrack | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormMode("create");
  };
  const openEdit = (t: AdminTrack) => {
    setEditing(t);
    setFormMode("edit");
    setDetail(null);
  };

  const handleHideRequest = (t: AdminTrack) => {
    setHideTarget(t);
    setDetail(null);
  };

  const handleRestore = (t: AdminTrack) => {
    restoreTrack(t.id);
    toast.success(catalogStrings.hide.toastRestored);
    setDetail(null);
  };

  const handleExport = () => toast.success(catalogStrings.importExport.export.toast);

  return (
    <>
      <CatalogHeader
        onAddTrack={openCreate}
        onImportCsv={() => setImportOpen(true)}
        onExportCsv={handleExport}
      />

      <section aria-label={catalogStrings.stats.total} className="pb-6">
        <CatalogStats />
      </section>

      <section className="pb-6">
        <CatalogFilters
          value={filters}
          onChange={setFilters}
          onReset={resetFilters}
          shown={filtered.length}
          total={adminCatalogStats.total}
        />
      </section>

      <section className="pb-6">
        <CatalogTable
          tracks={filtered}
          onViewDetail={setDetail}
          onEdit={openEdit}
          onHide={handleHideRequest}
          onRestore={handleRestore}
        />
      </section>

      <section className="pb-6">
        <OperationalNote />
      </section>

      <TrackDetailSheet
        track={detail}
        onOpenChange={(o) => !o && setDetail(null)}
        onEdit={openEdit}
        onHide={handleHideRequest}
        onRestore={handleRestore}
      />

      <TrackFormDialog
        open={formMode !== null}
        mode={formMode ?? "create"}
        track={editing}
        onOpenChange={(o) => !o && setFormMode(null)}
        onSubmit={upsertTrack}
      />

      <HideTrackDialog
        track={hideTarget}
        onOpenChange={(o) => !o && setHideTarget(null)}
        onConfirm={(t) => hideTrack(t.id)}
      />

      <ImportCsvDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
