import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircle2,
  CreditCard,
  Building2,
  XCircle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponsiveDialog } from "@/shared/components/ds/ResponsiveDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError } from "@/api/client";
import type {
  BankTransferInstructions,
  CreditPackage,
  PaymentMethod,
  Purchase,
  PurchaseQuote,
} from "@/api/types";
import {
  useConfirmBankTransferIntent,
  useConfirmCardPurchase,
  useCreateQuote,
  useDevConfirmBankTransfer,
  useWalletAggregate,
} from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { downloadQuotePdf } from "@/modules/packages/packages/utils/generateQuotePdf";
import { downloadReceiptPdf } from "@/modules/packages/packages/utils/generateReceiptPdf";
import { DemoNoticeBanner } from "../shared/DemoNoticeBanner";

type Step =
  | "loading"
  | "review"
  | "method"
  | "card"
  | "processing"
  | "bank"
  | "success"
  | "failed";

interface PurchaseDialogProps {
  pkg: CreditPackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cardSchema = z.object({
  cardholderName: z.string().min(3, packagesStrings.purchaseDialog.card.errors.cardholder),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, packagesStrings.purchaseDialog.card.errors.number)),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, packagesStrings.purchaseDialog.card.errors.expiryMonth),
  expiryYear: z.string().regex(/^\d{2}$/, packagesStrings.purchaseDialog.card.errors.expiryYear),
  cvv: z.string().regex(/^\d{3}$/, packagesStrings.purchaseDialog.card.errors.cvv),
  forceFailure: z.boolean().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

export function PurchaseDialog({ pkg, open, onOpenChange }: PurchaseDialogProps) {
  const s = packagesStrings.purchaseDialog;
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("loading");
  const [quote, setQuote] = useState<PurchaseQuote | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("card-simulated");
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [transferInstructions, setTransferInstructions] =
    useState<BankTransferInstructions | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const wallet = useWalletAggregate();
  const createQuote = useCreateQuote();
  const confirmCard = useConfirmCardPurchase();
  const confirmBank = useConfirmBankTransferIntent();
  const devConfirm = useDevConfirmBankTransfer();

  const cardForm = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      forceFailure: false,
    },
  });

  // Reset + create quote whenever dialog opens with a package
  const handleOpenChange = (next: boolean) => {
    if (step === "processing") return;
    if (!next) {
      setStep("loading");
      setQuote(null);
      setPurchase(null);
      setTransferInstructions(null);
      setErrorMessage(null);
      setErrorCode(null);
      cardForm.reset();
    }
    onOpenChange(next);
  };

  // Initialise quote when opening
  if (open && pkg && step === "loading" && !createQuote.isPending && !quote) {
    createQuote.mutate(
      { packageId: pkg.id },
      {
        onSuccess: (q) => {
          setQuote(q);
          setStep("review");
        },
        onError: () => {
          setErrorMessage("No pudimos generar la cotización.");
          setStep("failed");
        },
      },
    );
  }

  const onCardSubmit = (values: CardFormValues) => {
    if (!quote) return;
    setStep("processing");
    setErrorMessage(null);
    confirmCard.mutate(
      {
        quoteId: quote.id,
        cardholderName: values.cardholderName ?? "",
        cardNumber: values.cardNumber ?? "",
        expiryMonth: values.expiryMonth ?? "",
        expiryYear: values.expiryYear ?? "",
        cvv: values.cvv ?? "",
        forceFailure: values.forceFailure,
      },
      {
        onSuccess: (p) => {
          setPurchase(p);
          setStep("success");
          toast.success(
            formatString(s.success.toast, {
              balance: formatCredits((wallet.data?.balance ?? 0) + p.packageSnapshot.credits),
            }),
          );
        },
        onError: (err) => {
          if (isApiError(err)) {
            setErrorCode(err.code);
            setErrorMessage(
              s.failed.reasons[err.code as keyof typeof s.failed.reasons] ?? err.message,
            );
          } else {
            setErrorMessage(s.failed.defaultReason);
          }
          setStep("failed");
        },
      },
    );
  };

  const onChooseBank = () => {
    if (!quote) return;
    confirmBank.mutate(
      { quoteId: quote.id },
      {
        onSuccess: (res) => {
          setPurchase(res.purchase);
          setTransferInstructions(res.instructions);
          setStep("bank");
        },
        onError: () => {
          setErrorMessage(s.failed.defaultReason);
          setStep("failed");
        },
      },
    );
  };

  const onDevConfirm = () => {
    if (!purchase) return;
    devConfirm.mutate(purchase.id, {
      onSuccess: (p) => {
        setPurchase(p);
        setStep("success");
      },
    });
  };

  const copyToClipboard = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!pkg) return null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      dismissible={step !== "processing"}
      initialSnap="full"
      contentClassName="max-h-[100dvh] max-w-2xl overflow-y-auto"
    >
      <DialogHeader>
          <DialogTitle>
            {formatString(s.title, { packageName: pkg.name })}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {s.steps[step === "loading" ? "review" : step === "card" ? "card" : step === "method" ? "method" : step === "processing" ? "processing" : step === "bank" ? "bankTransfer" : step === "success" ? "success" : step === "failed" ? "failed" : "review"]}
          </DialogDescription>
        </DialogHeader>

        {step === "loading" ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : null}

        {step === "review" && quote ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="text-sm text-muted-foreground">{s.review.packageBlock}</div>
              <div className="text-lg font-semibold">{quote.packageSnapshot.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatString(s.review.conceptCredits, {
                  credits: formatCredits(quote.packageSnapshot.credits),
                  months: quote.packageSnapshot.validityMonths,
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm font-medium">{s.review.breakdown}</div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.review.subtotal}</span>
                <span>{formatCop(quote.subtotalCop)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.review.iva}</span>
                <span>{formatCop(quote.ivaCop)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>{s.review.total}</span>
                <span>{formatCop(quote.totalCop)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatString(s.review.validUntil, { date: formatDate(quote.validUntil) })}
            </p>
            <DemoNoticeBanner message={packagesStrings.demoNotice.quote} />
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => downloadQuotePdf(quote)}>
                {s.review.downloadQuote}
              </Button>
              <div className="flex flex-1 justify-end gap-2">
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                  {s.review.cancel}
                </Button>
                <Button onClick={() => setStep("method")}>{s.review.continue}</Button>
              </div>
            </DialogFooter>
          </div>
        ) : null}

        {step === "method" ? (
          <div className="space-y-4">
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">{s.method.legend}</legend>
              <RadioGroup
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
                className="space-y-2"
              >
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/40">
                  <RadioGroupItem value="card-simulated" id="m-card" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="h-4 w-4" aria-hidden="true" />
                      {s.method.card}
                    </div>
                    <p className="text-sm text-muted-foreground">{s.method.cardDescription}</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/40">
                  <RadioGroupItem value="bank-transfer-simulated" id="m-bank" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                      {s.method.bank}
                    </div>
                    <p className="text-sm text-muted-foreground">{s.method.bankDescription}</p>
                  </div>
                </label>
              </RadioGroup>
            </fieldset>
            <p className="text-xs text-muted-foreground">{s.method.disclaimer}</p>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="ghost" onClick={() => setStep("review")}>{s.method.back}</Button>
              <Button
                onClick={() => (method === "card-simulated" ? setStep("card") : onChooseBank())}
                disabled={confirmBank.isPending}
              >
                {confirmBank.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                {s.method.continue}
              </Button>
            </DialogFooter>
          </div>
        ) : null}

        {step === "card" && quote ? (
          <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cardholderName">{s.card.cardholderLabel}</Label>
              <Input
                id="cardholderName"
                placeholder={s.card.cardholderPlaceholder}
                {...cardForm.register("cardholderName")}
              />
              {cardForm.formState.errors.cardholderName ? (
                <p className="text-xs text-destructive">{cardForm.formState.errors.cardholderName.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">{s.card.numberLabel}</Label>
              <Input
                id="cardNumber"
                inputMode="numeric"
                placeholder={s.card.numberPlaceholder}
                {...cardForm.register("cardNumber")}
              />
              <p className="text-xs text-muted-foreground">{s.card.numberHint}</p>
              {cardForm.formState.errors.cardNumber ? (
                <p className="text-xs text-destructive">{cardForm.formState.errors.cardNumber.message}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="expiryMonth">{s.card.expiryMonthLabel}</Label>
                <Input id="expiryMonth" inputMode="numeric" placeholder="MM" maxLength={2} {...cardForm.register("expiryMonth")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiryYear">{s.card.expiryYearLabel}</Label>
                <Input id="expiryYear" inputMode="numeric" placeholder="YY" maxLength={2} {...cardForm.register("expiryYear")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv">{s.card.cvvLabel}</Label>
                <Input id="cvv" inputMode="numeric" placeholder="123" maxLength={3} {...cardForm.register("cvv")} />
              </div>
            </div>
            {import.meta.env.DEV ? (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" {...cardForm.register("forceFailure")} />
                {s.card.forceFailure}
              </label>
            ) : null}
            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep("method")}>
                {s.card.back}
              </Button>
              <Button type="submit">
                {formatString(s.card.pay, {
                  total: formatCop(quote.totalCop).replace(/[^\d.,]/g, ""),
                })}
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {step === "processing" ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
            <p className="text-lg font-medium">{s.processing.title}</p>
            <p className="text-sm text-muted-foreground">{s.processing.description}</p>
          </div>
        ) : null}

        {step === "bank" && transferInstructions && purchase ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{s.bankTransfer.description}</p>
            <div className="space-y-2 rounded-lg border p-4 text-sm">
              <Row label={s.bankTransfer.bank} value={transferInstructions.bankName} />
              <Row label={s.bankTransfer.accountType} value={transferInstructions.accountType} />
              <Row label={s.bankTransfer.accountNumber} value={transferInstructions.accountNumber} />
              <Row label={s.bankTransfer.accountHolder} value={transferInstructions.accountHolder} />
              <Row label={s.bankTransfer.nit} value={transferInstructions.nit} />
              <Row
                label={s.bankTransfer.reference}
                value={transferInstructions.reference}
                copyable
                copied={copied === "ref"}
                onCopy={() => copyToClipboard("ref", transferInstructions.reference)}
              />
              <Row
                label={s.bankTransfer.amount}
                value={formatCop(transferInstructions.amountCop)}
                copyable
                copied={copied === "amt"}
                onCopy={() => copyToClipboard("amt", String(transferInstructions.amountCop))}
              />
              <Row
                label={s.bankTransfer.expiresAt.split(":")[0] ?? "Vence"}
                value={formatDate(transferInstructions.expiresAt)}
              />
            </div>
            <DemoNoticeBanner message={s.bankTransfer.disclaimer} />
            <DialogFooter className="gap-2 sm:gap-2">
              {import.meta.env.DEV ? (
                <Button variant="outline" onClick={onDevConfirm} disabled={devConfirm.isPending}>
                  {devConfirm.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  {s.bankTransfer.devConfirm}
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  handleOpenChange(false);
                  navigate(`/packages/history/${purchase.id}`);
                }}
              >
                {s.bankTransfer.done}
              </Button>
            </DialogFooter>
          </div>
        ) : null}

        {step === "success" && purchase ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
              <h3 className="text-xl font-semibold">{s.success.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatString(s.success.description, {
                  credits: formatCredits(purchase.packageSnapshot.credits),
                  date: formatDate(
                    new Date(
                      Date.now() + purchase.packageSnapshot.validityMonths * 30 * 86_400_000,
                    ).toISOString(),
                  ),
                })}
              </p>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
              <Button variant="outline" onClick={() => downloadReceiptPdf(purchase)}>
                {s.success.downloadReceipt}
              </Button>
              <div className="flex flex-1 justify-end gap-2">
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                  {s.success.close}
                </Button>
                <Button
                  onClick={() => {
                    handleOpenChange(false);
                    navigate("/catalog");
                  }}
                >
                  {s.success.goToCatalog}
                </Button>
              </div>
            </DialogFooter>
          </div>
        ) : null}

        {step === "failed" ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <XCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
              <h3 className="text-xl font-semibold">{s.failed.title}</h3>
              <Alert variant="destructive">
                <AlertDescription>
                  {errorMessage ?? s.failed.defaultReason}
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                {s.failed.cancel}
              </Button>
              {errorCode !== "QUOTE_EXPIRED" ? (
                <Button onClick={() => setStep("card")}>{s.failed.retry}</Button>
              ) : null}
            </DialogFooter>
          </div>
        ) : null}
    </ResponsiveDialog>
  );
}

interface RowProps {
  label: string;
  value: string;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}

function Row({ label, value, copyable, copied, onCopy }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-medium">
        {value}
        {copyable ? (
          <button
            type="button"
            onClick={onCopy}
            className="rounded p-1 hover:bg-muted"
            aria-label={`Copiar ${label}`}
            aria-live="polite"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </span>
    </div>
  );
}
