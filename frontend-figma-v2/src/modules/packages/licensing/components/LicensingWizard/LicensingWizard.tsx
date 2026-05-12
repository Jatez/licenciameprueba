import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLicensingWizardStore } from "@/stores/licensingWizardStore";
import { useWizardGuard } from "@/modules/packages/licensing/hooks/useWizardGuard";
import { useValidateLicensing } from "@/modules/packages/licensing/hooks/useValidateLicensing";
import { useTrackDetail } from "@/modules/tracks/hooks/useTrackDetail";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { LicensingWizardLayout } from "./LicensingWizardLayout";
import { LicensingWizardFooter } from "./LicensingWizardFooter";
import { LicensingWizardCancelDialog } from "./LicensingWizardCancelDialog";
import { Step1TrackConfirmation } from "./steps/Step1TrackConfirmation";
import { Step2UsageTypeSelection } from "./steps/Step2UsageTypeSelection";
import { Step3Summary } from "./steps/Step3Summary";
import { Step4Confirmation } from "./steps/Step4Confirmation";

interface Props {
  trackId: string;
}

/**
 * Wizard orchestrator. Steps 3 & 4 land in Prompt 2 — for now we render a
 * placeholder so the navigation contract is fully wired and testable.
 */
export function LicensingWizard({ trackId }: Props) {
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);
  const {
    currentStep,
    selectedUsageType,
    issuedLicense,
    setTrackId,
    setUsageType,
    nextStep,
    prevStep,
    reset,
  } = useLicensingWizardStore();

  // Hydrate trackId in the store from the URL on mount / when it changes.
  useEffect(() => {
    setTrackId(trackId);
  }, [trackId, setTrackId]);

  useWizardGuard(trackId);

  // beforeunload while a license is in flight (steps 1-3 and pre-issuance).
  useEffect(() => {
    const shouldWarn = currentStep < 4 && !issuedLicense;
    if (!shouldWarn) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = licensingStrings.wizard.leaveWarning;
      return licensingStrings.wizard.leaveWarning;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [currentStep, issuedLicense]);

  // Esc → open cancel dialog (only while wizard is in progress).
  useEffect(() => {
    if (issuedLicense) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !cancelOpen) {
        e.preventDefault();
        setCancelOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cancelOpen, issuedLicense]);

  const trackQuery = useTrackDetail(trackId);
  const validation = useValidateLicensing(trackId, selectedUsageType);

  const handleConfirmCancel = () => {
    reset();
    setCancelOpen(false);
    navigate("/catalog", { replace: true });
  };

  const stepConfig = useMemo(() => {
    if (currentStep === 1) {
      return {
        body: (
          <Step1TrackConfirmation
            trackId={trackId}
            onContinue={nextStep}
            onCancel={() => setCancelOpen(true)}
          />
        ),
        canAdvance: !!trackQuery.data,
        nextDisabledReason: null,
        showFooterNext: false,
      };
    }
    if (currentStep === 2) {
      const reason = !selectedUsageType
        ? licensingStrings.wizard.nextDisabledReasons.noUsageType
        : validation.isFetching
        ? licensingStrings.wizard.nextDisabledReasons.validating
        : !validation.data?.allowed
        ? validation.data?.reasons.includes("INSUFFICIENT_CREDITS")
          ? licensingStrings.wizard.nextDisabledReasons.insufficient
          : licensingStrings.wizard.nextDisabledReasons.notAllowed
        : null;
      return {
        body: trackQuery.data ? (
          <Step2UsageTypeSelection
            track={trackQuery.data.track}
            selectedUsageType={selectedUsageType}
            onSelectUsageType={setUsageType}
          />
        ) : null,
        canAdvance: !!validation.data?.allowed,
        nextDisabledReason: reason,
        showFooterNext: true,
      };
    }
    if (currentStep === 3 && trackQuery.data && selectedUsageType) {
      return {
        body: (
          <Step3Summary
            track={trackQuery.data.track}
            usageType={selectedUsageType}
            onBack={prevStep}
          />
        ),
        canAdvance: false,
        nextDisabledReason: null,
        showFooterNext: false,
      };
    }
    if (currentStep === 4 && issuedLicense) {
      return {
        body: <Step4Confirmation license={issuedLicense} />,
        canAdvance: false,
        nextDisabledReason: null,
        showFooterNext: false,
      };
    }
    // Defensive fallback — guard should have redirected before we reach here.
    return {
      body: (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Cargando...
        </div>
      ),
      canAdvance: false,
      nextDisabledReason: null,
      showFooterNext: false,
    };
  }, [
    currentStep,
    trackId,
    trackQuery.data,
    selectedUsageType,
    validation.data,
    validation.isFetching,
    issuedLicense,
    nextStep,
    prevStep,
    setUsageType,
  ]);

  const shouldShowFooter = currentStep === 2;

  return (
    <>
      <LicensingWizardLayout
        currentStep={currentStep}
        trackId={trackId}
        trackTitle={trackQuery.data?.track.title}
        onCancelClick={() => setCancelOpen(true)}
        body={stepConfig.body}
        footer={shouldShowFooter ? (
          <LicensingWizardFooter
            canGoPrev={currentStep > 1 && !issuedLicense}
            canGoNext={stepConfig.canAdvance}
            nextDisabledReason={stepConfig.nextDisabledReason}
            showNext={stepConfig.showFooterNext}
            onPrev={prevStep}
            onNext={() => {
              if (!stepConfig.canAdvance) {
                if (stepConfig.nextDisabledReason) {
                  toast.error(stepConfig.nextDisabledReason);
                }
                return;
              }
              nextStep();
            }}
          />
        ) : undefined}
      />
      <LicensingWizardCancelDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
