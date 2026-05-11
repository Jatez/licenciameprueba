import { Badge } from "@/components/ui/badge";
import { matchTracksStrings } from "../strings";
import type { MatchStatus } from "../types";

const VARIANT: Record<MatchStatus, "vigente" | "pendiente" | "expirada"> = {
  matched: "vigente",
  partial: "pendiente",
  not_available: "expirada",
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  return <Badge variant={VARIANT[status]}>{matchTracksStrings.status[status]}</Badge>;
}
