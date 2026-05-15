import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CreditPackage, PurchaseQuote } from "@/api/types";
import { useCreateQuote, usePurchaseQuote } from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { downloadQuotePdf } from "@/modules/packages/packages/utils/generateQuotePdf";
import { DemoNoticeBanner } from "../../shared/DemoNoticeBanner";
import type { CheckoutDraft } from "../checkoutDraft.types";

interface Step4Props {
  draft: CheckoutDraft;
  selectedPackage: CreditPackage;
  onQuoteCreated: (quote: PurchaseQuote) => void;
  onTermsChange: (accepted: boolean) => void;
  onEditBilling: () => void;
  onEditMethod: () => void;
}

export function Step4Review({
  draft,
  selectedPackage,
  onQuoteCreated,
  onTermsChange,
  onEditBilling,
  onEditMethod,
}: Step4Props) {
  const s = packagesStrings.checkout.step4;
  const sm = packagesStrings.checkout.method;
  const createQuote = useCreateQuote();
  const existingQuote = usePurchaseQuote(draft.quoteId ?? undefined);
  const [downloading, setDownloading] = useState(false);

  // Auto-create quote on mount if missing or expired.
  useEffect(() => {
    if (draft.quoteId) return;
    if (createQuote.isPending) return;
    createQuote
      .mutateAsync({ packageId: selectedPackage.id })
      .then(onQuoteCreated)
      .catch(() => {
        // Error surfaced inline below.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.quoteId, selectedPackage.id]);

  const quote = existingQuote.data ?? createQuote.data ?? null;
  const isLoadingQuote = createQuote.isPending || existingQuote.isLoading;
  const hasError = createQuote.isError && !quote;

  const handleDownload = async () => {
    if (!quote) return;
    setDownloading(true);
    try {
      downloadQuotePdf(quote);
      toast.success(s.downloadSuccess);
    } finally {
      setDownloading(false);
    }
  };

  const methodLabel =
    draft.paymentMethod === "card-simulated" ? sm.card : sm.bank;

  return (
    <section aria-labelledby="step4-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="step4-heading" className="text-lg font-semibold text-foreground">
          {s.title}
        </h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      <DemoNoticeBanner tone="warning" message={packagesStrings.demoNotice.quote} />

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
        🔒 Serás redirigido a <strong>Wompi</strong> para completar el pago de forma segura.
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.packageBlock}
            </p>
            <p className="text-base font-semibold text-foreground">
              {selectedPackage.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatString(s.creditsLine, {
                credits: formatCredits(selectedPackage.credits),
                months: selectedPackage.validityMonths,
              })}
            </p>
          </div>

          <Separator />

          {isLoadingQuote ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {s.loadingQuote}
            </div>
          ) : hasError ? (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>{s.quoteError}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    createQuote
                      .mutateAsync({ packageId: selectedPackage.id })
                      .then(onQuoteCreated)
                      .catch(() => undefined)
                  }
                >
                  {s.retry}
                </Button>
              </AlertDescription>
            </Alert>
          ) : quote ? (
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{s.subtotal}</span>
                <span>{formatCop(quote.subtotalCop)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="underline decoration-dotted underline-offset-2">
                        {s.iva}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{s.ivaTooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>{formatCop(quote.ivaCop)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 text-lg font-semibold text-foreground">
                <span>{s.total}</span>
                <span>{formatCop(quote.totalCop)}</span>
              </div>
              <p className="pt-2 text-xs text-muted-foreground">
                {formatString(s.validUntil, { date: formatDate(quote.validUntil) })}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.billingTitle}
              </p>
              <button
                type="button"
                onClick={onEditBilling}
                className="text-xs font-medium text-foreground underline underline-offset-2"
              >
                {s.edit}
              </button>
            </div>
            {draft.billing ? (
              <div className="space-y-0.5 text-sm">
                <p className="font-medium text-foreground">
                  {draft.billing.legalName}
                </p>
                <p className="text-muted-foreground">NIT {draft.billing.taxId}</p>
                <p className="text-muted-foreground">{draft.billing.billingEmail}</p>
                <p className="text-muted-foreground">
                  {draft.billing.fiscalAddress} · {draft.billing.city}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.methodTitle}
              </p>
              <button
                type="button"
                onClick={onEditMethod}
                className="text-xs font-medium text-foreground underline underline-offset-2"
              >
                {s.edit}
              </button>
            </div>
            <p className="text-sm text-foreground">{methodLabel}</p>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={!quote || downloading}
        className="w-full sm:w-auto"
      >
        {downloading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        {s.downloadQuote}
      </Button>

      <label className="flex items-start gap-2 rounded-md border border-border bg-surface p-3 text-sm">
        <Checkbox
          id="terms"
          checked={draft.termsAccepted}
          onCheckedChange={(v) => onTermsChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-foreground">
          {s.terms}{" "}
          <a
            href="#"
            className="underline underline-offset-2"
            onClick={(e) => e.preventDefault()}
          >
            {s.termsLink}
          </a>
          .
        </span>
      </label>
    </section>
  );
}
