import { Download } from "lucide-react";
import { editorialStrings } from "../strings";

type PaymentStatus = "paid" | "pending";

interface PaymentRowProps {
  date: string;
  packageName: string;
  amount: string;
  status: PaymentStatus;
}

/**
 * Single timeline-style payment entry. Status dot + meta + ghost download.
 */
export function PaymentRow({ date, packageName, amount, status }: PaymentRowProps) {
  const t = editorialStrings.payments;
  const isPaid = status === "paid";

  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-6">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-pill ${
          isPaid ? "bg-success" : "bg-warning"
        }`}
      />

      <div className="flex-1 grid gap-1 sm:grid-cols-3 sm:items-center sm:gap-4">
        <span className="text-sm text-muted-foreground">{date}</span>
        <span className="text-sm font-medium text-foreground">{packageName}</span>
        <span className="font-serif text-lg text-foreground">{amount}</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-pill px-3 py-1 text-xs font-medium ${
            isPaid
              ? "bg-success/15 text-success"
              : "bg-warning/15 text-warning"
          }`}
        >
          {isPaid ? t.paid : t.pending}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {t.downloadInvoice}
        </button>
      </div>
    </div>
  );
}
