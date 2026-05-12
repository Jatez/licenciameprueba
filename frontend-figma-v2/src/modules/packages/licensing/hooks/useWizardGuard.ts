import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLicensingWizardStore } from "@/stores/licensingWizardStore";

/**
 * Redirects when the user lands on a step without satisfying its prerequisites.
 * Mounted once at the wizard root.
 */
export function useWizardGuard(routeTrackId?: string | null) {
  const navigate = useNavigate();
  const { currentStep, trackId, selectedUsageType, issuedLicense, goToStep } =
    useLicensingWizardStore();

  useEffect(() => {
    const effectiveTrackId = trackId ?? routeTrackId ?? null;

    if (!effectiveTrackId) {
      navigate("/catalog", { replace: true });
      return;
    }
    if (currentStep === 2 && !effectiveTrackId) goToStep(1);
    if (currentStep === 3 && !selectedUsageType) goToStep(2);
    if (currentStep === 4 && !issuedLicense) goToStep(1);
  }, [currentStep, trackId, routeTrackId, selectedUsageType, issuedLicense, goToStep, navigate]);
}
