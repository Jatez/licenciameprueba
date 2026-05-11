import { Music, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface NoPostsDetectedProps {
  licenseId: string;
}

export function NoPostsDetected({ licenseId }: NoPostsDetectedProps) {
  const navigate = useNavigate();
  const openManualLink = useTrackingStore((s) => s.openManualLinkDialog);
  const t = trackingStrings.associatedContent.noPosts;

  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center">
      <Music
        className="mx-auto h-8 w-8 text-muted-foreground"
        aria-hidden="true"
      />
      <h3 className="mt-3 text-sm font-semibold text-foreground">{t.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        <strong className="block text-foreground">{t.stillNotPublished}</strong>
        {t.description}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button size="sm" onClick={() => openManualLink(licenseId)}>
          {t.manualLinkCta}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/social-accounts")}
        >
          <Wifi className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {t.connectSocialCta}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate("/monitoring")}>
          {t.viewMonitoringCta}
        </Button>
      </div>
    </div>
  );
}
