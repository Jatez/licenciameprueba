import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { billingStrings } from "../strings";
import { formatCop } from "../mocks";
import type { AdminPayment } from "../types";

interface Props {
  payment: AdminPayment | null;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function InvoiceMockDialog({ payment, onOpenChange }: Props) {
  const t = billingStrings.invoice;
  const open = Boolean(payment);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 sm:p-8">
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rotate-[-18deg] select-none whitespace-nowrap rounded border-2 border-error/30 px-4 py-1 text-base font-bold text-error/30 sm:text-2xl">
                {t.stamp}
              </span>
            </span>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-0.5">
                  <p className="text-lg font-semibold text-foreground">{t.issuer.name}</p>
                  <p className="text-xs text-muted-foreground font-tnum">{t.issuer.taxId}</p>
                  <p className="text-xs text-muted-foreground">{t.issuer.address}</p>
                  <p className="text-xs text-muted-foreground">{t.issuer.email}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t.fields.invoiceNumber}
                  </p>
                  <p className="text-base font-semibold text-foreground font-tnum">
                    {payment.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Field label={t.fields.issueDate} value={formatDate(payment.createdAt)} />
                <Field label={t.fields.dueDate} value={formatDate(payment.paidAt)} />
                <Field label={t.fields.method} value={billingStrings.method[payment.method]} />
                <Field
                  label={t.fields.bankRef}
                  value={
                    <span className="font-tnum text-xs">{payment.bankReference ?? "—"}</span>
                  }
                />
              </div>

              <div className="rounded-md bg-muted/40 p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.fields.bilingTo}
                </p>
                <p className="text-sm font-semibold text-foreground">{payment.companyName}</p>
                <p className="text-xs text-muted-foreground font-tnum">{payment.companyTaxId}</p>
                <p className="text-xs text-muted-foreground">{payment.companyAddress}</p>
              </div>

              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">{t.table.concept}</th>
                      <th className="px-3 py-2 text-right">{t.table.qty}</th>
                      <th className="px-3 py-2 text-right">{t.table.unitPrice}</th>
                      <th className="px-3 py-2 text-right">{t.table.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-3 py-3 text-foreground">{payment.packageName}</td>
                      <td className="px-3 py-3 text-right font-tnum">1</td>
                      <td className="px-3 py-3 text-right font-tnum">
                        {formatCop(payment.amountSubtotalCop)}
                      </td>
                      <td className="px-3 py-3 text-right font-tnum">
                        {formatCop(payment.amountSubtotalCop)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.totals.subtotal}</span>
                  <span className="font-tnum">{formatCop(payment.amountSubtotalCop)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.totals.iva}</span>
                  <span className="font-tnum">{formatCop(payment.amountIvaCop)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-foreground">
                  <span>{t.totals.total}</span>
                  <span className="font-tnum">{formatCop(payment.amountTotalCop)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t.close}
          </Button>
          <Button onClick={() => toast.info(t.downloadToast)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.download}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
