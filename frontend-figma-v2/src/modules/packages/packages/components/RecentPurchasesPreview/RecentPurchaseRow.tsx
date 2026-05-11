import { ChevronRight } from "lucide-react";
import type { Purchase } from "@/api/types";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { PurchaseStatusBadge } from "../PurchaseHistoryPage/PurchaseStatusBadge";

interface RecentPurchaseRowProps {
  purchase: Purchase;
  onSelect: (purchase: Purchase) => void;
}

/** Resolves a human-readable reason for non-final purchase states. */
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

export function RecentPurchaseRow({ purchase, onSelect }: RecentPurchaseRowProps) {
  const s = packagesStrings.walletHub.recent;
  const reason = resolveReason(purchase);
  const reasonId = reason ? `reason-${purchase.id}` : undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(purchase)}
      aria-label={formatString(s.rowAria, { id: purchase.id })}
      className="group flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {purchase.packageSnapshot.name}
          </span>
          <PurchaseStatusBadge status={purchase.status} describedById={reasonId} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDate(purchase.createdAt)} ·{" "}
          {purchase.packageSnapshot.credits.toLocaleString("es-CO")} créditos
        </p>
      </div>
      <div className="hidden text-right text-sm font-semibold text-foreground sm:block">
        {formatCop(purchase.totalCop)}
      </div>
      <ChevronRight
        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
      {reason && reasonId ? (
        <span id={reasonId} className="sr-only">
          {formatString(s.reasonAria, { reason })}
        </span>
      ) : null}
    </button>
  );
}
