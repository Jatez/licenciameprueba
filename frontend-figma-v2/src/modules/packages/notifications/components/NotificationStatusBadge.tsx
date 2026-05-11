import { Badge } from "@/components/ui/badge";
import { notificationsStrings } from "../strings";
import type { NotificationStatus } from "../types";

interface NotificationStatusBadgeProps {
  status: NotificationStatus;
}

const VARIANT_MAP: Record<NotificationStatus, "vigente" | "pendiente" | "info"> = {
  sent: "vigente",
  pending_rule: "pendiente",
  needs_definition: "info",
};

export function NotificationStatusBadge({ status }: NotificationStatusBadgeProps) {
  return (
    <Badge variant={VARIANT_MAP[status]}>
      {notificationsStrings.status[status]}
    </Badge>
  );
}
