import { Badge } from "@/components/ui/badge";
import { catalogStrings } from "../strings";
import type { AdminTrackStatus } from "../types";

const VARIANT: Record<
  AdminTrackStatus,
  "vigente" | "consumida" | "expirada" | "pendiente" | "info"
> = {
  active: "vigente",
  hidden: "consumida",
  legal_review: "expirada",
  unavailable: "consumida",
  pending_metadata: "pendiente",
};

export function TrackStatusBadge({ status }: { status: AdminTrackStatus }) {
  return <Badge variant={VARIANT[status]}>{catalogStrings.status[status]}</Badge>;
}
