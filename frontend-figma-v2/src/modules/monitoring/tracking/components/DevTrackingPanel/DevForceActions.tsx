import { Button } from "@/components/ui/button";
import { trackingSimulator } from "@/shared/tracking-simulator";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import type { SocialPlatformF06 } from "@/api/types";

interface DevForceActionsProps {
  kind: "detection" | "errors";
}

export function DevForceActions({ kind }: DevForceActionsProps) {
  if (kind === "detection") return <DetectionActions />;
  return <ErrorActions />;
}

function DetectionActions() {
  const t = trackingStrings.devPanel.forceActions;
  return (
    <div className="grid grid-cols-1 gap-2">
      <Button variant="secondary" size="sm" onClick={() => trackingSimulator.triggerDetection()}>
        {t.detectRandom}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          trackingSimulator.triggerDetection({ platform: "instagram", postType: "story" })
        }
      >
        {t.detectStory}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => trackingSimulator.triggerDetection({ forceNoMatch: true })}
      >
        {t.detectNoMatch}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          trackingSimulator.triggerDetection({ platform: "facebook", forceNoMatch: true })
        }
      >
        {t.detectUnconnected}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          trackingSimulator.triggerDetection({
            platform: "instagram",
            postType: "story",
            forceImmediateExpiration: true,
          })
        }
      >
        {t.expireSoon}
      </Button>
    </div>
  );
}

function ErrorActions() {
  const t = trackingStrings.devPanel.forceErrors;
  const trigger = (platform: SocialPlatformF06, type: string) => () =>
    trackingSimulator.triggerError(platform, type);
  return (
    <div className="grid grid-cols-1 gap-2">
      <Button variant="secondary" size="sm" onClick={trigger("instagram", "rate_limited")}>
        {t.instagramRateLimit}
      </Button>
      <Button variant="secondary" size="sm" onClick={trigger("tiktok", "token_expired")}>
        {t.tiktokTokenExpired}
      </Button>
      <Button variant="secondary" size="sm" onClick={trigger("facebook", "error")}>
        {t.facebookDown}
      </Button>
    </div>
  );
}
