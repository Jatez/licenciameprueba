import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { LicensingWizard } from "@/modules/packages/licensing";
import { licensingStrings } from "@/modules/packages/licensing/strings";

/** /licensing/new?trackId={id} — entry point for F-05 wizard. */
export default function LicensingNew() {
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get("trackId");

  useEffect(() => {
    if (!trackId) {
      toast.error(licensingStrings.errors.missingTrackId);
    }
  }, [trackId]);

  if (!trackId) {
    return <Navigate to="/catalog" replace />;
  }

  return <LicensingWizard trackId={trackId} />;
}
