import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { authStrings } from "../../../strings";

export function VerifyEmailDevHelpers() {
  const mocksEnabled = useFeatureFlag("MOCKS_ENABLED");
  if (!mocksEnabled) return null;
  const t = authStrings.verifyEmail.devTools;
  return (
    <div className="mt-6 rounded-md border border-dashed border-border p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Wrench className="h-3 w-3" aria-hidden="true" />
        {t.label}
      </p>
      <ul className="space-y-1 text-xs">
        <li>
          <Link to="/verify-email?token=MOCK_VALID_TOKEN" className="text-foreground underline-offset-4 hover:underline">
            {t.simulateValid}
          </Link>
        </li>
        <li>
          <Link to="/verify-email?token=MOCK_EXPIRED_TOKEN" className="text-foreground underline-offset-4 hover:underline">
            {t.simulateExpired}
          </Link>
        </li>
      </ul>
    </div>
  );
}
