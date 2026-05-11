import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type {
  BillingProfile,
  CreditPackage,
  CreditPackageId,
  PaymentMethod,
  PurchaseErrorCode,
  PurchaseQuote,
} from "@/api/types";
import {
  useCreditPackages,
  useWalletAggregate,
} from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { DemoNoticeBanner } from "../shared/DemoNoticeBanner";
import { CheckoutSummarySidebar } from "./CheckoutSummarySidebar";
import { CheckoutWizardStepper } from "./CheckoutWizardStepper";
import type {
  CheckoutCardFields,
  CheckoutResultStatus,
  CheckoutStep,
} from "./checkoutDraft.types";
import { useCheckoutDraft } from "./useCheckoutDraft";
import { Step1SelectPackage } from "./steps/Step1SelectPackage";
import { Step2BillingProfile } from "./steps/Step2BillingProfile";
import { Step3PaymentMethod } from "./steps/Step3PaymentMethod";
import { Step4Review } from "./steps/Step4Review";
import { Step5Result } from "./steps/Step5Result";

export function CheckoutWizard() {
  const s = packagesStrings.checkout;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetPackageId = searchParams.get("package") as CreditPackageId | null;

  const { draft, update, clearDraft, restored, dismissRestoredBanner } =
    useCheckoutDraft();
  const packages = useCreditPackages();
  const wallet = useWalletAggregate();

  const [cardValid, setCardValid] = useState(false);

  // Apply preset package id from query param if draft is empty.
  useEffect(() => {
    if (presetPackageId && !draft.packageId) {
      update({ packageId: presetPackageId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetPackageId]);

  const selectedPackage: CreditPackage | null = useMemo(() => {
    if (!draft.packageId || !packages.data) return null;
    return packages.data.find((p) => p.id === draft.packageId) ?? null;
  }, [draft.packageId, packages.data]);

  const activeBagsCount =
    wallet.data?.bags.filter((b) => b.status === "active").length ?? 0;

  const goTo = (step: CheckoutStep) => update({ step });
  const next = () => update({ step: Math.min(5, draft.step + 1) as CheckoutStep });
  const back = () => update({ step: Math.max(1, draft.step - 1) as CheckoutStep });

  const handleSelectPackage = (pkg: CreditPackage) => {
    update({ packageId: pkg.id, quoteId: null });
  };

  const handleBillingSaved = (profile: BillingProfile) => {
    update({ billing: profile });
    next();
  };

  const handleMethodChange = (method: PaymentMethod) => {
    update({ paymentMethod: method });
  };

  const handleCardChange = (
    fields: Partial<CheckoutCardFields>,
    valid: boolean,
  ) => {
    update({ cardData: { ...(draft.cardData ?? {}), ...fields } });
    setCardValid(valid);
  };

  const handleQuoteCreated = (quote: PurchaseQuote) => {
    update({ quoteId: quote.id });
  };

  const handleResultStatus = (
    status: CheckoutResultStatus,
    extras?: { purchaseId?: string | null; failureCode?: PurchaseErrorCode | null },
  ) => {
    update({
      resultStatus: status,
      ...(extras?.purchaseId !== undefined ? { purchaseId: extras.purchaseId } : {}),
      ...(extras?.failureCode !== undefined ? { failureCode: extras.failureCode } : {}),
    });
  };

  const handleResetForRetry = () => {
    update({ step: 3, resultStatus: "idle", failureCode: null, purchaseId: null });
  };

  const handleChangeMethodAndRetry = () => {
    update({
      step: 3,
      paymentMethod: "bank-transfer-simulated",
      resultStatus: "idle",
      failureCode: null,
      purchaseId: null,
    });
  };

  const handleFinish = () => {
    clearDraft();
  };

  const canContinueFromStep = (): boolean => {
    if (draft.step === 1) return !!draft.packageId;
    if (draft.step === 3) {
      if (draft.paymentMethod === "card-simulated") return cardValid;
      return draft.paymentMethod === "bank-transfer-simulated";
    }
    if (draft.step === 4) return draft.termsAccepted && !!draft.quoteId;
    return true;
  };

  const handleResetAll = () => {
    clearDraft();
    navigate("/wallet/checkout", { replace: true });
  };

  const showFooter = draft.step !== 2 && draft.step !== 5;

  return (
    <>
      <div className="space-y-4">
        <header className="space-y-2">
          <button
            type="button"
            onClick={() => navigate("/packages")}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
          >
            ← {s.breadcrumb}
          </button>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {s.title}
          </h1>
          <p className="text-sm text-muted-foreground">{s.subtitle}</p>
        </header>

        <DemoNoticeBanner
          tone="neutral"
          message={packagesStrings.demoNotice.pageBanner}
        />

        {restored ? (
          <Alert className="border-info/30 bg-info-subtle">
            <AlertDescription className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>{s.resumeBanner}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={dismissRestoredBanner}>
                  {s.continue}
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetAll}>
                  {s.resetAll}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : null}

        <CheckoutWizardStepper current={draft.step} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {draft.step === 1 ? (
              <Step1SelectPackage
                selectedId={draft.packageId}
                onSelect={handleSelectPackage}
              />
            ) : null}

            {draft.step === 2 ? (
              <Step2BillingProfile
                initial={draft.billing}
                onSaved={handleBillingSaved}
              />
            ) : null}

            {draft.step === 3 ? (
              <Step3PaymentMethod
                draft={draft}
                onMethodChange={handleMethodChange}
                onCardChange={handleCardChange}
              />
            ) : null}

            {draft.step === 4 && selectedPackage ? (
              <Step4Review
                draft={draft}
                selectedPackage={selectedPackage}
                onQuoteCreated={handleQuoteCreated}
                onTermsChange={(v) => update({ termsAccepted: v })}
                onEditBilling={() => goTo(2)}
                onEditMethod={() => goTo(3)}
              />
            ) : null}

            {draft.step === 5 && selectedPackage ? (
              <Step5Result
                draft={draft}
                selectedPackage={selectedPackage}
                onChangeStatus={handleResultStatus}
                onRetry={handleResetForRetry}
                onChangeMethod={handleChangeMethodAndRetry}
                onBackToReview={() => {
                  update({ step: 4, resultStatus: "idle", failureCode: null });
                }}
                onFinish={handleFinish}
              />
            ) : null}

            {showFooter ? (
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <Button
                  variant="outline"
                  onClick={back}
                  disabled={draft.step === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  {s.back}
                </Button>
                <Button onClick={next} disabled={!canContinueFromStep()}>
                  {draft.step === 4 ? s.confirm : s.continue}
                  {draft.step !== 4 ? (
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  ) : null}
                </Button>
              </div>
            ) : null}
          </div>

          <CheckoutSummarySidebar
            draft={draft}
            selectedPackage={selectedPackage}
            activeBagsCount={activeBagsCount}
          />
        </div>
      </div>
    </>
  );
}
