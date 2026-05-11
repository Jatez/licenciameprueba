import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { AdminPageTitle } from "@/modules/admin";
import { Button } from "@/components/ui/button";
import {
  CompaniesStats,
  CompaniesFilters,
  CompaniesTable,
  CompanyDetailSheet,
  SuspendCompanyDialog,
  CustomPlanDialog,
  useAdminCompanies,
  companiesStrings,
  type AdminCompany,
} from "@/modules/admin/companies";

export default function AdminCompanies() {
  const t = companiesStrings.page;
  const { companies, filtered, filters, setFilters, resetFilters, stats, setStatus, assignCustomPlan } =
    useAdminCompanies();

  const [detail, setDetail] = useState<AdminCompany | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<AdminCompany | null>(null);
  const [planTarget, setPlanTarget] = useState<AdminCompany | null>(null);

  const handleReactivate = (c: AdminCompany) => {
    setStatus(c.id, "active");
    toast.success(companiesStrings.suspend.reactivateToast);
  };

  return (
    <>
      <AdminPageTitle
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button variant="secondary" onClick={() => toast(t.exportToast)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.exportCta}
          </Button>
        }
      />

      <div className="space-y-6">
        <CompaniesStats stats={stats} />
        <CompaniesFilters
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          shown={filtered.length}
          total={companies.length}
        />
        <CompaniesTable
          rows={filtered}
          onView={setDetail}
          onAssignPlan={setPlanTarget}
          onSuspend={setSuspendTarget}
          onReactivate={handleReactivate}
        />
      </div>

      <CompanyDetailSheet
        company={detail}
        open={!!detail}
        onOpenChange={(o) => !o && setDetail(null)}
      />
      <SuspendCompanyDialog
        company={suspendTarget}
        open={!!suspendTarget}
        onOpenChange={(o) => !o && setSuspendTarget(null)}
        onConfirm={(id) => setStatus(id, "suspended")}
      />
      <CustomPlanDialog
        company={planTarget}
        open={!!planTarget}
        onOpenChange={(o) => !o && setPlanTarget(null)}
        onConfirm={assignCustomPlan}
      />
    </>
  );
}
