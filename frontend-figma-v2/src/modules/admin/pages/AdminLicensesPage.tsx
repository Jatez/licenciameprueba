import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/modules/admin";
import { Button } from "@/components/ui/button";
import {
  LicensesFilters,
  LicensesStats,
  LicensesTable,
  LicenseDetailSheet,
  licensesStrings,
  useAdminLicenses,
  type AdminLicense,
} from "@/modules/admin/licenses";

/**
 * F-09 · /admin/licenses — global licenses view with evidence trail.
 * 100% UI demo. No backend.
 */
export default function AdminLicenses() {
  const { filtered, filters, setFilters, resetFilters, stats, licenses } = useAdminLicenses();
  const [selected, setSelected] = useState<AdminLicense | null>(null);
  const t = licensesStrings.page;

  return (
    <>
      <AdminPageTitle
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button variant="secondary" onClick={() => toast.info(t.exportToast)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.exportCta}
          </Button>
        }
      />

      <div className="space-y-6">
        <LicensesStats stats={stats} />
        <LicensesFilters
          value={filters}
          onChange={setFilters}
          onReset={resetFilters}
          shown={filtered.length}
          total={licenses.length}
        />
        <LicensesTable licenses={filtered} onSelect={setSelected} />
      </div>

      <LicenseDetailSheet
        license={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
