import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface ManualLinkSuccessProps {
  licenseId: string;
  onLinkAnother: () => void;
  onClose: () => void;
}

export function ManualLinkSuccess({
  licenseId,
  onLinkAnother,
  onClose,
}: ManualLinkSuccessProps) {
  const navigate = useNavigate();
  const t = trackingStrings.manualLink.success;

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle2 size={48} className="text-[#166534]" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t.message.replace("{licenseId}", licenseId)}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => navigate(`/licenses/${licenseId}`)}>
          {t.viewLicenseCta}
        </Button>
        <Button variant="outline" onClick={onLinkAnother}>
          {t.linkAnotherCta}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {t.closeCta}
        </Button>
      </div>
    </div>
  );
}
