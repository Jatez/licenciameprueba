import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/modules/admin";
import { Button } from "@/components/ui/button";
import {
  BillingFilters,
  BillingStats,
  BillingTable,
  PaymentDetailSheet,
  InvoiceMockDialog,
  billingStrings,
  useAdminBilling,
  type AdminPayment,
} from "@/modules/admin/billing";

/**
 * F-09 · /admin/billing — payments, invoices, credit notes (UI demo only).
 */
export default function AdminBilling() {
  const { filtered, filters, setFilters, resetFilters, stats, payments, reconcile, markFailed } =
    useAdminBilling();
  const [selected, setSelected] = useState<AdminPayment | null>(null);
  const [invoice, setInvoice] = useState<AdminPayment | null>(null);
  const t = billingStrings.page;

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
        <BillingStats stats={stats} />
        <BillingFilters
          value={filters}
          onChange={setFilters}
          onReset={resetFilters}
          shown={filtered.length}
          total={payments.length}
        />
        <BillingTable
          payments={filtered}
          onSelect={setSelected}
          onViewInvoice={setInvoice}
        />
      </div>

      <PaymentDetailSheet
        payment={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onViewInvoice={(p) => {
          setInvoice(p);
        }}
        onReconcile={(id) => {
          reconcile(id);
          setSelected((prev) =>
            prev && prev.id === id
              ? { ...prev, status: "paid", paidAt: prev.paidAt ?? new Date().toISOString() }
              : prev,
          );
        }}
        onMarkFailed={(id) => {
          markFailed(id);
          setSelected((prev) => (prev && prev.id === id ? { ...prev, status: "failed" } : prev));
        }}
      />

      <InvoiceMockDialog
        payment={invoice}
        onOpenChange={(open) => !open && setInvoice(null)}
      />
    </>
  );
}
