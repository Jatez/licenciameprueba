import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, Download, ExternalLink, RefreshCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { Purchase, PurchaseStatus } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { downloadReceiptPdf } from "@/modules/packages/packages/utils/generateReceiptPdf";
import { CorporateSupportCard } from "../CorporateSupportCard";
import { ProvisionalDocumentBadge } from "../ProvisionalDocumentBadge";
import { PurchaseTimeline } from "../PurchaseTimeline";
import { PurchaseStatusBadge } from "../PurchaseHistoryPage/PurchaseStatusBadge";

interface Props {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Provided when the page can re-open the purchase dialog with this package. */
  onRetryPayment?: (purchase: Purchase) => void;
}

const HIGH_AMOUNT_COP = 100_000_000;
const SUPPORT_EMAIL = packagesStrings.support.corporate.email;

const NON_FINAL_STATUSES: ReadonlyArray<PurchaseStatus> = [
  "rejected",
  "failed",
  "pending_confirmation",
  "manual_review",
];

function isNonFinal(status: PurchaseStatus): boolean {
  return NON_FINAL_STATUSES.includes(status);
}

function resolveReason(purchase: Purchase): string | null {
  switch (purchase.status) {
    case "rejected":
    case "failed":
      return (
        purchase.rejectionReason ??
        purchase.failureReason ??
        packagesStrings.drawer.reasonDefault.rejected
      );
    case "pending_confirmation":
      return purchase.reviewReason ?? packagesStrings.drawer.reasonDefault.pending_confirmation;
    case "manual_review":
      return purchase.manualReviewReason ?? packagesStrings.drawer.reasonDefault.manual_review;
    default:
      return null;
  }
}

export function PurchaseDetailDrawer({
  purchase,
  open,
  onOpenChange,
  onRetryPayment,
}: Props) {
  const s = packagesStrings.drawer;
  const sh = packagesStrings.history;

  if (!purchase) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[480px]"
          aria-label={s.aria}
        >
          <SheetHeader>
            <SheetTitle>{s.aria}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const reason = resolveReason(purchase);
  const reasonId = reason ? `drawer-reason-${purchase.id}` : undefined;
  const isRejected = purchase.status === "rejected" || purchase.status === "failed";
  const ReasonIcon = isRejected ? XCircle : AlertTriangle;
  const reasonIconClass = isRejected ? "text-destructive" : "text-warning";

  const showSupport =
    purchase.totalCop >= HIGH_AMOUNT_COP || isNonFinal(purchase.status);

  const handleDownload = () => {
    downloadReceiptPdf(purchase);
    toast.success(sh.receiptDownloadedToast);
  };

  const supportHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `Soporte compra ${purchase.id}`,
  )}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-[480px]"
        aria-label={s.aria}
      >
        <SheetHeader className="space-y-2 border-b p-5 text-left">
          <SheetTitle className="text-base font-semibold">
            {purchase.id}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <PurchaseStatusBadge
              status={purchase.status}
              describedById={reasonId}
            />
            {purchase.isProvisionalDocument ? (
              <ProvisionalDocumentBadge />
            ) : null}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 p-5">
          <section aria-label={s.sections.summary} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {s.sections.summary}
            </h3>
            <Row label={sh.columns.date} value={formatDate(purchase.createdAt)} />
            <Row
              label={sh.columns.package}
              value={purchase.packageSnapshot.name}
            />
            <Row
              label={sh.columns.credits}
              value={`${formatCredits(purchase.creditsCredited)} / ${formatCredits(purchase.packageSnapshot.credits)}`}
            />
            <Row
              label={sh.columns.method}
              value={sh.methods[purchase.paymentMethod]}
            />
            <Row label={sh.columns.total} value={formatCop(purchase.totalCop)} />
          </section>

          {reason ? (
            <>
              <Separator />
              <section aria-label={s.sections.reason} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.sections.reason}
                </h3>
                <div
                  className={`flex items-start gap-2 rounded-md border ${
                    isRejected
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-warning/40 bg-warning-subtle"
                  } p-3`}
                >
                  <ReasonIcon
                    className={`mt-0.5 h-4 w-4 shrink-0 ${reasonIconClass}`}
                    aria-hidden="true"
                  />
                  <p
                    id={reasonId}
                    className="text-sm text-foreground"
                  >
                    {reason}
                  </p>
                </div>
              </section>
            </>
          ) : null}

          <Separator />

          <section aria-label={s.sections.timeline} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {s.sections.timeline}
            </h3>
            <PurchaseTimeline events={purchase.events} ariaLabel={s.sections.timeline} />
          </section>

          <Separator />

          <section aria-label={s.sections.documents} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {s.sections.documents}
            </h3>
            {purchase.status === "confirmed" ? (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                {sh.downloadReceipt}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                {packagesStrings.detail.documents.receiptNotAvailable}
              </p>
            )}
          </section>

          {showSupport ? (
            <>
              <Separator />
              <section aria-label={s.sections.support}>
                <CorporateSupportCard />
              </section>
            </>
          ) : null}
        </div>

        <SheetFooter className="sticky bottom-0 flex-col gap-2 border-t bg-background p-4 sm:flex-row">
          {isRejected && onRetryPayment ? (
            <Button
              className="flex-1"
              onClick={() => onRetryPayment(purchase)}
            >
              <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              {s.actions.retry}
            </Button>
          ) : null}
          {isNonFinal(purchase.status) ? (
            <Button asChild variant="outline" className="flex-1">
              <a href={supportHref}>{s.actions.contactSupport}</a>
            </Button>
          ) : (
            <Button asChild variant="outline" className="flex-1">
              <Link to={`/packages/history/${purchase.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                {s.fullDetail}
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {s.close}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
