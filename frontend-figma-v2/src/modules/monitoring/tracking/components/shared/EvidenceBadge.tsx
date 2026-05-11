/**
 * Evidence badge — variant chosen by `evidenceStatus`. For ephemeral posts
 * still alive, shows a live "Expira en Xh Ym" countdown updated every minute.
 */
import { useEffect, useState } from "react";
import { Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DetectedPost, EvidenceStatus } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import {
  formatCountdownTo,
  isWithinNextHour,
} from "@/modules/monitoring/tracking/utils/relativeTime";

interface EvidenceBadgeProps {
  post: DetectedPost;
}

export function EvidenceBadge({ post }: EvidenceBadgeProps) {
  const [now, setNow] = useState(() => Date.now());

  const isEphemeralLive =
    post.postType === "story" &&
    post.evidenceStatus === "live" &&
    !!post.evidenceExpiresAt &&
    new Date(post.evidenceExpiresAt).getTime() > now;

  useEffect(() => {
    if (!isEphemeralLive) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [isEphemeralLive]);

  if (isEphemeralLive) {
    const countdown = formatCountdownTo(post.evidenceExpiresAt, now);
    const label = `${trackingStrings.postCard.evidenceStatus.ephemeralLive} · ${countdown}`;
    const live = isWithinNextHour(post.evidenceExpiresAt, now) ? "polite" : "off";
    return (
      <Badge variant="pendiente" aria-live={live} aria-label={label}>
        <Clock size={10} className="mr-1" aria-hidden="true" />
        {label}
      </Badge>
    );
  }

  const status: EvidenceStatus = post.evidenceStatus;

  if (status === "ephemeral-preserved") {
    return (
      <Badge variant="pendiente">
        <ShieldCheck size={10} className="mr-1" aria-hidden="true" />
        {trackingStrings.postCard.evidenceStatus.ephemeralPreserved}
      </Badge>
    );
  }

  if (status === "removed-by-platform") {
    return (
      <Badge variant="expirada">
        <AlertTriangle size={10} className="mr-1" aria-hidden="true" />
        {trackingStrings.postCard.evidenceStatus.removedByPlatform}
      </Badge>
    );
  }

  if (status === "unavailable") {
    return (
      <Badge variant="consumida">
        {trackingStrings.postCard.evidenceStatus.unavailable}
      </Badge>
    );
  }

  // Live, non-ephemeral → no badge needed (UI is implicit).
  return null;
}
