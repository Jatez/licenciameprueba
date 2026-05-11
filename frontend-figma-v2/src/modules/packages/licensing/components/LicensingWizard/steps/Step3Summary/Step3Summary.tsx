import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LicenseUsageType, LicensingErrorCode, Track } from "@/api/types";
import { useLicensingWizardStore } from "@/stores/licensingWizardStore";
import { useLicensingTerms } from "@/modules/packages/licensing/hooks/useLicensingTerms";
import { useUsageTypeCatalog } from "@/modules/packages/licensing/hooks/useUsageTypeCatalog";
import { useValidateLicensing } from "@/modules/packages/licensing/hooks/useValidateLicensing";
import { useIssueLicense } from "@/modules/packages/licensing/hooks/useIssueLicense";
import { useWalletBalance } from "@/modules/packages/licensing/hooks/useWalletBalance";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { SummaryTrackBlock } from "./parts/SummaryTrackBlock";
import { SummaryUsageBlock } from "./parts/SummaryUsageBlock";
import { SummaryBalanceBlock } from "./parts/SummaryBalanceBlock";
import { LegalTermsBlock } from "./parts/LegalTermsBlock";
import { CancellationPolicyNote } from "./parts/CancellationPolicyNote";
import { ConsentCheckbox } from "./parts/ConsentCheckbox";
import { SubmitErrorBanner, type SubmitErrorAction } from "./parts/SubmitErrorBanner";

interface Props {
  track: Track;
  usageType: LicenseUsageType;
  onBack: () => void;
}

const PACKAGES_ROUTE = "/packages";

function openBuyCredits() {
  if (typeof window !== "undefined") {
    window.open(PACKAGES_ROUTE, "_blank", "noopener,noreferrer");
  }
}

export function Step3Summary({ track, usageType, onBack }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.step3;
  const {
    acceptedTermsVersion,
    acceptTerms,
    setIssuedLicense,
  } = useLicensingWizardStore();

  const wallet = useWalletBalance();
  const catalog = useUsageTypeCatalog();
  const terms = useLicensingTerms();
  const validation = useValidateLicensing(track.id, usageType);
  const issue = useIssueLicense();

  const [errorCode, setErrorCode] = useState<LicensingErrorCode | null>(null);

  // Force a fresh preflight when entering this step (and if user reopens).
  useEffect(() => {
    validation.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const definition = useMemo(
    () => catalog.data?.find((d) => d.id === usageType),
    [catalog.data, usageType],
  );

  const isConsented = !!acceptedTermsVersion && acceptedTermsVersion === terms.data?.version;

  const handleConsentChange = (checked: boolean) => {
    if (checked && terms.data) {
      acceptTerms(terms.data.version);
    } else {
      // Clear stored version by re-accepting an empty marker is not allowed by store.
      // Easiest: set acceptedTermsVersion null via a small store reset on uncheck.
      useLicensingWizardStore.setState({
        acceptedTermsVersion: null,
        acceptedAt: null,
      });
    }
  };

  const submit = () => {
    if (!terms.data || !isConsented) return;
    setErrorCode(null);
    issue.mutate(
      {
        trackId: track.id,
        usageType,
        acceptedTermsVersion: terms.data.version,
        acceptedAt: new Date().toISOString(),
      },
      {
        onSuccess: ({ license }) => {
          setIssuedLicense(license);
        },
        onError: (err) => {
          const code = (err.code as LicensingErrorCode) ?? "UNEXPECTED_ERROR";
          setErrorCode(code);
        },
      },
    );
  };

  const handleErrorAction = (action: SubmitErrorAction) => {
    setErrorCode(null);
    switch (action) {
      case "retry":
        submit();
        break;
      case "back":
        onBack();
        break;
      case "buy":
        openBuyCredits();
        break;
      case "refresh-terms":
        terms.refetch();
        // user must re-accept
        useLicensingWizardStore.setState({
          acceptedTermsVersion: null,
          acceptedAt: null,
        });
        break;
      case "support":
        if (typeof window !== "undefined") {
          window.location.href = "mailto:soporte@licenciame.co";
        }
        break;
      case "cancel":
        navigate("/catalog", { replace: true });
        break;
    }
  };

  // ---- Loading / preflight states ----
  const isPreflightFailed =
    validation.data && !validation.data.allowed && !errorCode;

  if (validation.isLoading || !definition || terms.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t.revalidating}
        </div>
      </div>
    );
  }

  const balance = validation.data?.currentBalance ?? wallet.balance;
  const required = validation.data?.requiredCredits ?? definition.creditCost;
  const resulting = validation.data?.resultingBalance ?? Math.max(0, balance - required);

  const isSubmitting = issue.isPending;
  const canSubmit = isConsented && !isSubmitting && !isPreflightFailed;

  // ---- Render ----
  return (
    <div className="flex flex-col gap-5">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          {t.title}
        </h2>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <SummaryTrackBlock track={track} />
      <SummaryUsageBlock
        usageType={usageType}
        definition={definition}
        platformLicensability={track.platformLicensability}
      />
      <SummaryBalanceBlock
        current={balance}
        consumed={required}
        resulting={resulting}
      />
      <LegalTermsBlock terms={terms.data} isLoading={terms.isLoading} />
      <CancellationPolicyNote policy={terms.data?.cancellationPolicy} />

      {isPreflightFailed && (
        <SubmitErrorBanner
          code={
            validation.data?.reasons.includes("INSUFFICIENT_CREDITS")
              ? "INSUFFICIENT_CREDITS"
              : "UNEXPECTED_ERROR"
          }
          context={{ balance, required }}
          onAction={handleErrorAction}
        />
      )}

      {errorCode && (
        <SubmitErrorBanner
          code={errorCode}
          context={{
            balance,
            required,
            reference: `ERR-${Date.now().toString(36).toUpperCase()}`,
          }}
          onAction={handleErrorAction}
        />
      )}

      <ConsentCheckbox
        checked={isConsented}
        onChange={handleConsentChange}
        disabled={isSubmitting}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="sm:w-auto"
        >
          ← {licensingStrings.wizard.previous}
        </Button>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="sm:w-auto">
                <Button
                  size="lg"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="w-full sm:w-auto"
                  aria-label={t.submit.idle}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      {t.submit.pending}
                    </>
                  ) : (
                    <>
                      {validation.isFetching && (
                        <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                      )}
                      {t.submit.idle}
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            {!canSubmit && !isSubmitting && (
              <TooltipContent>{t.submit.disabledTooltip}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
