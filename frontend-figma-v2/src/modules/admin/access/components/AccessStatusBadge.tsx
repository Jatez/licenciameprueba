import { Badge } from "@/components/ui/badge";
import { accessStrings } from "../strings";
import type { AccessUserStatus, InvitationStatus } from "../types";

const USER_VARIANT: Record<AccessUserStatus, "vigente" | "expirada" | "pendiente"> = {
  active: "vigente",
  suspended: "expirada",
  pending_mfa: "pendiente",
};

const INV_VARIANT: Record<InvitationStatus, "pendiente" | "expirada" | "vigente"> = {
  pending: "pendiente",
  expired: "expirada",
  accepted: "vigente",
};

export function AccessUserStatusBadge({ status }: { status: AccessUserStatus }) {
  return <Badge variant={USER_VARIANT[status]}>{accessStrings.status[status]}</Badge>;
}

export function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  return <Badge variant={INV_VARIANT[status]}>{accessStrings.invitationStatus[status]}</Badge>;
}
