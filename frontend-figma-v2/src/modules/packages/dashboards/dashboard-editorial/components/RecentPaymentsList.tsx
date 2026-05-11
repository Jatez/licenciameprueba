import { ArrowRight } from "lucide-react";
import { PaymentRow } from "./PaymentRow";
import { editorialStrings } from "../strings";

const PAYMENTS = [
  {
    date: "20 mar 2026",
    packageName: "Bolsa B",
    amount: "$166.000.000 COP",
    status: "paid" as const,
  },
  {
    date: "12 ene 2026",
    packageName: "Bolsa A",
    amount: "$90.000.000 COP",
    status: "paid" as const,
  },
  {
    date: "5 dic 2025",
    packageName: "Bolsa A",
    amount: "$90.000.000 COP",
    status: "paid" as const,
  },
];

/** Recent payments timeline section. */
export function RecentPaymentsList() {
  const t = editorialStrings.payments;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">
          {t.title}
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-pill px-3 py-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
        >
          {t.seeAll}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div className="rounded-lg border border-border bg-card px-6 md:px-8">
        {PAYMENTS.map((payment) => (
          <PaymentRow key={`${payment.date}-${payment.packageName}`} {...payment} />
        ))}
      </div>
    </section>
  );
}
