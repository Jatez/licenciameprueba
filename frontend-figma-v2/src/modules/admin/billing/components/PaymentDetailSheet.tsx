import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { PaymentTimeline } from "./PaymentTimeline";
import { PaymentErrorState } from "./PaymentErrorState";
import { billingStrings } from "../strings";
import { formatCop } from "../mocks";
import type { AdminPayment } from "../types";

interface Props {
  payment: AdminPayment | null;
  onOpenChange: (open: boolean) => void;
  onViewInvoice: (p: AdminPayment) => void;
  onReconcile: (id: string) => void;
  onMarkFailed: (id: string) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground break-words">{value}</p>
    </div>
  );
}

export function PaymentDetailSheet({
  payment,
  onOpenChange,
  onViewInvoice,
  onReconcile,
  onMarkFailed,
}: Props) {
  const t = billingStrings.detail;
  const open = Boolean(payment);
  const canReconcile = payment && (payment.status === "pending" || payment.status === "processing");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
        aria-describedby="payment-detail-description"
      >
        {payment && (
          <>
            <SheetHeader>
              <SheetTitle>{t.title}</SheetTitle>
              <SheetDescription id="payment-detail-description">
                {t.description}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <BillingStatusBadge status={payment.status} />
                  <p className="text-2xl font-semibold text-foreground font-tnum">
                    {formatCop(payment.amountTotalCop)}
                  </p>
                  <p className="text-xs text-muted-foreground font-tnum">
                    {payment.invoiceNumber}
                  </p>
                </div>
                <Button variant="secondary" onClick={() => onViewInvoice(payment)}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {t.actions.viewInvoice}
                </Button>
              </div>

              {payment.status === "failed" && payment.errorReason && (
                <PaymentErrorState
                  reason={payment.errorReason}
                  onRetry={() => {
                    toast.info(t.actions.retryToast);
                  }}
                  onMarkFailed={() => {
                    onMarkFailed(payment.id);
                    toast.success(t.actions.markedFailedToast);
                  }}
                />
              )}

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.sections.summary}</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t.fields.invoice} value={<span className="font-tnum">{payment.invoiceNumber}</span>} />
                  <Field label={t.fields.company} value={payment.companyName} />
                  <Field label={t.fields.taxId} value={<span className="font-tnum">{payment.companyTaxId}</span>} />
                  <Field label={t.fields.package} value={payment.packageName} />
                  <Field label={t.fields.credits} value={<span className="font-tnum">{payment.creditsPurchased.toLocaleString("es-CO")}</span>} />
                  <Field label={t.fields.method} value={billingStrings.method[payment.method]} />
                  <Field
                    label={t.fields.bankRef}
                    value={<span className="font-tnum text-xs">{payment.bankReference ?? "—"}</span>}
                  />
                  <Field label={t.fields.subtotal} value={<span className="font-tnum">{formatCop(payment.amountSubtotalCop)}</span>} />
                  <Field label={t.fields.iva} value={<span className="font-tnum">{formatCop(payment.amountIvaCop)}</span>} />
                  <Field label={t.fields.total} value={<span className="font-tnum font-semibold">{formatCop(payment.amountTotalCop)}</span>} />
                  <Field label={t.fields.createdAt} value={formatDate(payment.createdAt)} />
                  <Field label={t.fields.paidAt} value={formatDate(payment.paidAt)} />
                  {payment.reconciledByName && (
                    <Field label={t.fields.reconciledBy} value={payment.reconciledByName} />
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.sections.timeline}</p>
                <PaymentTimeline events={payment.timeline} />
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.sections.actions}</p>
                <div className="flex flex-wrap gap-2">
                  {canReconcile && (
                    <Button
                      onClick={() => {
                        onReconcile(payment.id);
                        toast.success(t.actions.reconciledToast);
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      {t.actions.reconcile}
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => toast.info(t.actions.creditNoteToast)}
                  >
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    {t.actions.issueCreditNote}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
