import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MatchStatus } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface MatchStatusBadgeProps {
  status: MatchStatus;
}

const VARIANT_BY_STATUS: Record<
  MatchStatus,
  "vigente" | "info" | "pendiente" | "expirada" | "consumida"
> = {
  "matched-auto": "vigente",
  "matched-manual": "info",
  "pending-match": "consumida",
  "no-match-found": "pendiente",
  unlinked: "expirada",
  "expired-before-publish": "consumida",
};

export function MatchStatusBadge({ status }: MatchStatusBadgeProps) {
  const label = trackingStrings.postCard.matchStatus[status];
  const aria = trackingStrings.postCard.matchStatusAria.replace("{status}", label);
  return (
    <Badge variant={VARIANT_BY_STATUS[status]} aria-label={aria}>
      {status === "pending-match" && (
        <Loader2 size={10} className="mr-1 animate-spin" aria-hidden="true" />
      )}
      {label}
    </Badge>
  );
}
