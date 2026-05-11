import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircle2,
  Copy,
  Check as CheckIcon,
  Download,
  Loader2,
  XCircle,
  WifiOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isApiError } from "@/api/client";
import type {
  BankTransferInstructions,
  CreditPackage,
  Purchase,
  PurchaseErrorCode,
} from "@/api/types";
import {
  useConfirmBankTransferIntent,
  useConfirmCardPurchase,
  useDevConfirmBankTransfer,
  useWalletAggregate,
} from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { downloadReceiptPdf } from "@/modules/packages/packages/utils/generateReceiptPdf";
import type {
  CheckoutDraft,
  CheckoutResultStatus,
} from "../checkoutDraft.types";

interface Step5Props {
  draft: CheckoutDraft;
  selectedPackage: CreditPackage;
  onChangeStatus: (
    status: CheckoutResultStatus,
    extras?: { purchaseId?: string | null; failureCode?: PurchaseErrorCode | null },
  ) => void;
  onRetry: () => void;
  onChangeMethod: () => void;
  onBackToReview: () => void;
  onFinish: () => void;
}

export function Step5Result({
  draft,
  selectedPackage,
  onChangeStatus,
  onRetry,
  onChangeMethod,
  onBackToReview,
  onFinish,
}: Step5Props) {
  const s = packagesStrings.checkout.step5;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const confirmCard = useConfirmCardPurchase();
  const confirmBank = useConfirmBankTransferIntent();
  const devConfirm = useDevConfirmBankTransfer();
  const wallet = useWalletAggregate();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [instructions, setInstructions] =
    useState<BankTransferInstructions | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const startedRef = useRef(false);

  // Block tab close while processing.
  useEffect(() => {
    if (draft.resultStatus !== "processing") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [draft.resultStatus]);

  // Focus heading when reaching a terminal sub-state.
  useEffect(() => {
    if (
      draft.resultStatus === "approved" ||
      draft.resultStatus === "pending" ||
      draft.resultStatus === "rejected" ||
      draft.resultStatus === "network-error"
    ) {
      headingRef.current?.focus();
    }
  }, [draft.resultStatus]);

  // Kick off the payment exactly once when entering this step.
  useEffect(() => {
    if (startedRef.current) return;
    if (draft.resultStatus !== "idle" && draft.resultStatus !== "processing") return;
    if (!draft.quoteId || !draft.paymentMethod) return;
    startedRef.current = true;

    if (draft.paymentMethod === "card-simulated") {
      onChangeStatus("processing");
      confirmCard
        .mutateAsync({
          quoteId: draft.quoteId,
          cardholderName: draft.cardData?.cardholderName ?? "",
          cardNumber: draft.cardData?.cardNumber ?? "",
          expiryMonth: draft.cardData?.expiryMonth ?? "",
          expiryYear: draft.cardData?.expiryYear ?? "",
          cvv: draft.cardData?.cvv ?? "",
          forceFailure: draft.cardData?.forceFailure,
        })
        .then((p) => {
          setPurchase(p);
          onChangeStatus("approved", { purchaseId: p.id, failureCode: null });
          toast.success(
            formatString(s.approved.toast, {
              credits: formatCredits(p.packageSnapshot.credits),
            }),
          );
        })
        .catch((err) => {
          if (isApiError(err)) {
            onChangeStatus("rejected", {
              failureCode: err.code as PurchaseErrorCode,
            });
          } else {
            onChangeStatus("network-error");
          }
        });
    } else if (draft.paymentMethod === "bank-transfer-simulated") {
      onChangeStatus("processing");
      confirmBank
        .mutateAsync({ quoteId: draft.quoteId })
        .then((res) => {
          setPurchase(res.purchase);
          setInstructions(res.instructions);
          onChangeStatus("pending", { purchaseId: res.purchase.id });
          toast.message(s.pending.toast);
        })
        .catch((err) => {
          if (isApiError(err) && err.code === "QUOTE_EXPIRED") {
            onChangeStatus("rejected", { failureCode: "QUOTE_EXPIRED" });
          } else {
            onChangeStatus("network-error");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    });
  };

  // ─── PROCESSING ────────────────────────────────────────────────────────────
  if (draft.resultStatus === "processing" || draft.resultStatus === "idle") {
    return (
      <section
        aria-labelledby="step5-heading"
        role="status"
        aria-live="polite"
        className="space-y-3 rounded-lg border border-border bg-surface p-8 text-center"
      >
        <Loader2
          className="mx-auto h-10 w-10 animate-spin text-primary"
          aria-hidden="true"
        />
        <h2
          id="step5-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-foreground"
        >
          {s.processing.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {s.processing.description}
        </p>
      </section>
    );
  }

  // ─── APPROVED ──────────────────────────────────────────────────────────────
  if (draft.resultStatus === "approved" && purchase) {
    return <ApprovedView
      headingRef={headingRef}
      purchase={purchase}
      newBalance={wallet.data?.balance ?? null}
      onFinish={onFinish}
    />;
  }

  // ─── PENDING (transfer) ────────────────────────────────────────────────────
  if (draft.resultStatus === "pending" && instructions && purchase) {
    return (
      <PendingView
        headingRef={headingRef}
        instructions={instructions}
        purchase={purchase}
        billingEmail={draft.billing?.billingEmail ?? ""}
        copied={copied}
        onCopy={copy}
        onDevConfirm={() =>
          devConfirm.mutateAsync(purchase.id).then((p) => {
            setPurchase(p);
            onChangeStatus("approved", { purchaseId: p.id });
          })
        }
        onFinish={onFinish}
      />
    );
  }

  // ─── REJECTED (card) ───────────────────────────────────────────────────────
  if (draft.resultStatus === "rejected") {
    const code = draft.failureCode ?? "PAYMENT_DECLINED";
    const reason =
      packagesStrings.purchaseDialog.failed.reasons[
        code as keyof typeof packagesStrings.purchaseDialog.failed.reasons
      ] ?? packagesStrings.purchaseDialog.failed.defaultReason;
    return (
      <section
        aria-labelledby="step5-heading"
        className="space-y-4 rounded-lg border border-destructive/40 bg-destructive/5 p-6"
      >
        <div className="flex items-start gap-3">
          <XCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          <div className="space-y-1">
            <h2
              id="step5-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-lg font-semibold text-foreground"
            >
              {s.rejected.title}
            </h2>
            <p className="text-sm text-muted-foreground">{reason}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={onRetry} className="flex-1">
            {s.rejected.retry}
          </Button>
          <Button variant="outline" onClick={onChangeMethod} className="flex-1">
            {s.rejected.changeMethod}
          </Button>
        </div>
      </section>
    );
  }

  // ─── NETWORK ERROR ─────────────────────────────────────────────────────────
  return (
    <section
      aria-labelledby="step5-heading"
      className="space-y-4 rounded-lg border border-border bg-surface p-6"
    >
      <div className="flex items-start gap-3">
        <WifiOff
          className="h-6 w-6 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h2
            id="step5-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-semibold text-foreground"
          >
            {s.networkError.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {s.networkError.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onRetry} className="flex-1">
          {s.networkError.retry}
        </Button>
        <Button variant="outline" onClick={onBackToReview} className="flex-1">
          {s.networkError.backToReview}
        </Button>
      </div>
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ApprovedView({
  headingRef,
  purchase,
  newBalance,
  onFinish,
}: {
  headingRef: React.RefObject<HTMLHeadingElement>;
  purchase: Purchase;
  newBalance: number | null;
  onFinish: () => void;
}) {
  const s = packagesStrings.checkout.step5.approved;
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="step5-heading"
      className="space-y-4 rounded-lg border border-success/40 bg-success-subtle/40 p-6"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
        <div className="space-y-1">
          <h2
            id="step5-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-semibold text-foreground"
          >
            {s.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatString(s.description, {
              credits: formatCredits(purchase.packageSnapshot.credits),
              balance:
                newBalance !== null ? formatCredits(newBalance) : "—",
            })}
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button
          variant="outline"
          onClick={() => downloadReceiptPdf(purchase)}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          {s.downloadReceipt}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            onFinish();
            navigate("/packages");
          }}
        >
          {s.goToWallet}
        </Button>
        <Button
          onClick={() => {
            onFinish();
            navigate("/catalog");
          }}
        >
          {s.goToCatalog}
        </Button>
      </div>
    </section>
  );
}

function PendingView({
  headingRef,
  instructions,
  purchase,
  billingEmail,
  copied,
  onCopy,
  onDevConfirm,
  onFinish,
}: {
  headingRef: React.RefObject<HTMLHeadingElement>;
  instructions: BankTransferInstructions;
  purchase: Purchase;
  billingEmail: string;
  copied: string | null;
  onCopy: (key: string, value: string) => void;
  onDevConfirm: () => void;
  onFinish: () => void;
}) {
  const s = packagesStrings.checkout.step5.pending;
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  const Row = ({
    label,
    value,
    copyKey,
  }: {
    label: string;
    value: string;
    copyKey?: string;
  }) => (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground">{value}</span>
        {copyKey ? (
          <button
            type="button"
            aria-label={`${s.copy} ${label}`}
            aria-live="polite"
            onClick={() => onCopy(copyKey, value)}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
          >
            {copied === copyKey ? (
              <CheckIcon className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <section aria-labelledby="step5-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="step5-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-foreground"
        >
          {s.title}
        </h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      <Alert className="border-warning/40 bg-warning-subtle text-foreground">
        <AlertDescription className="text-foreground">
          {formatString(s.disclosure, { email: billingEmail || "—" })}
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="space-y-1 p-5">
          <Row label={s.fields.bank} value={instructions.bankName} />
          <Row label={s.fields.accountType} value={instructions.accountType} />
          <Row
            label={s.fields.accountNumber}
            value={instructions.accountNumber}
            copyKey="accountNumber"
          />
          <Row label={s.fields.holder} value={instructions.accountHolder} />
          <Row label={s.fields.nit} value={instructions.nit} />
          <Separator className="my-2" />
          <Row
            label={s.fields.reference}
            value={instructions.reference}
            copyKey="reference"
          />
          <Row
            label={s.fields.amount}
            value={formatCop(instructions.amountCop)}
            copyKey="amount"
          />
          <Row
            label={s.fields.expiresAt}
            value={formatDate(instructions.expiresAt)}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => downloadReceiptPdf(purchase)}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          {s.downloadInstructions}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            onFinish();
            navigate("/packages/history");
          }}
        >
          {s.goToHistory}
        </Button>
        {isDev ? (
          <Button onClick={onDevConfirm}>{s.devConfirm}</Button>
        ) : null}
      </div>
    </section>
  );
}
