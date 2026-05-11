import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Purchase } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { downloadReceiptPdf } from "@/modules/packages/packages/utils/generateReceiptPdf";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";

interface Props {
  purchase: Purchase;
  onQuickView: (purchase: Purchase) => void;
}

/** Stacked card for purchases on screens < md. Mirrors PurchaseHistoryTable rows. */
export function PurchaseHistoryCardMobile({ purchase: p, onQuickView }: Props) {
  const s = packagesStrings.history;

  const handleDownload = () => {
    downloadReceiptPdf(p);
    toast.success(s.receiptDownloadedToast);
  };

  return (
    <article className="rounded-lg border border-border bg-card p-4 space-y-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm text-foreground truncate">
            {p.packageSnapshot.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{p.id}</p>
        </div>
        <PurchaseStatusBadge status={p.status} />
      </header>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">{s.columns.date}</dt>
          <dd className="text-foreground">{formatDate(p.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{s.columns.method}</dt>
          <dd className="text-foreground">{s.methods[p.paymentMethod]}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{s.columns.creditsCredited}</dt>
          <dd className="text-foreground tabular-nums">
            {formatCredits(p.creditsCredited)}{" "}
            <span className="text-muted-foreground">
              / {formatCredits(p.packageSnapshot.credits)}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{s.columns.total}</dt>
          <dd className="text-foreground font-medium">{formatCop(p.totalCop)}</dd>
        </div>
      </dl>

      <footer className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="ghost"
          className="min-h-[44px]"
          aria-label={`${s.quickView} ${p.id}`}
          onClick={() => onQuickView(p)}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>
        {p.status === "confirmed" ? (
          <Button
            size="sm"
            variant="ghost"
            className="min-h-[44px]"
            aria-label={`${s.downloadReceipt} ${p.id}`}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
        <Button asChild size="sm" variant="outline" className="ml-auto min-h-[44px]">
          <Link to={`/packages/history/${p.id}`}>{s.viewDetail}</Link>
        </Button>
      </footer>
    </article>
  );
}
