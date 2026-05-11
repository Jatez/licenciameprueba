import { Badge } from "@/components/ui/badge";
import { adminStrings } from "../strings";
import type { AdminAlertSeverity } from "../mocks/adminMocks";

const SEVERITY_VARIANT: Record<
  AdminAlertSeverity,
  "expirada" | "pendiente" | "info" | "vigente"
> = {
  legal: "expirada",
  finance: "pendiente",
  ops: "info",
  catalog: "vigente",
};

interface AdminStatusBadgeProps {
  severity: AdminAlertSeverity;
}

export function AdminStatusBadge({ severity }: AdminStatusBadgeProps) {
  return <Badge variant={SEVERITY_VARIANT[severity]}>{adminStrings.alerts.severity[severity]}</Badge>;
}
