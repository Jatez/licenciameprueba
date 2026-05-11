import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CreditPackage } from "@/api/types";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import type { CheckoutDraft } from "./checkoutDraft.types";

interface CheckoutSummarySidebarProps {
  draft: CheckoutDraft;
  selectedPackage: CreditPackage | null;
  activeBagsCount: number;
}

const IVA_RATE = 0.19;

function buildAmounts(priceCop: number) {
  const subtotalCop = Math.round(priceCop / (1 + IVA_RATE));
  const ivaCop = priceCop - subtotalCop;
  return { subtotalCop, ivaCop, totalCop: priceCop };
}

export function CheckoutSummarySidebar({
  draft,
  selectedPackage,
  activeBagsCount,
}: CheckoutSummarySidebarProps) {
  const s = packagesStrings.checkout.summary;
  const sm = packagesStrings.checkout.method;

  const amounts = selectedPackage
    ? buildAmounts(selectedPackage.priceCop)
    : null;

  const methodLabel =
    draft.paymentMethod === "card-simulated"
      ? sm.card
      : draft.paymentMethod === "bank-transfer-simulated"
        ? sm.bank
        : null;

  return (
    <aside
      aria-label={s.aria}
      className="lg:sticky lg:top-4 lg:self-start"
    >
      <Card>
        <CardContent className="space-y-4 p-5">
          <h2 className="text-base font-semibold text-foreground">
            {s.title}
          </h2>

          {selectedPackage ? (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {selectedPackage.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCredits(selectedPackage.credits)} {s.creditsSuffix} ·{" "}
                  {formatString(s.validity, {
                    months: selectedPackage.validityMonths,
                  })}
                </p>
              </div>

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{s.subtotal}</span>
                  <span>{formatCop(amounts!.subtotalCop)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{s.iva}</span>
                  <span>{formatCop(amounts!.ivaCop)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-base font-semibold text-foreground">
                  <span>{s.total}</span>
                  <span>{formatCop(amounts!.totalCop)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{s.emptyPackage}</p>
          )}

          {draft.billing ? (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.billingTitle}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {draft.billing.legalName}
                </p>
                <p className="text-xs text-muted-foreground">
                  NIT {draft.billing.taxId}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {draft.billing.billingEmail}
                </p>
              </div>
            </>
          ) : null}

          {methodLabel ? (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.methodTitle}
                </p>
                <p className="text-sm text-foreground">{methodLabel}</p>
              </div>
            </>
          ) : null}

          <Separator />
          <div className="space-y-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <p>
              {activeBagsCount > 0
                ? formatString(s.accumulationActive, { count: activeBagsCount })
                : s.accumulationFirst}
            </p>
            <p>{s.fifo}</p>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
