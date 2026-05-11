import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { auditStrings } from "../strings";
import type { AuditSeverity } from "../types";

interface Props {
  severity: AuditSeverity;
  withIcon?: boolean;
}

const VARIANT: Record<AuditSeverity, "info" | "pendiente" | "expirada" | "vigente"> = {
  info: "info",
  warning: "pendiente",
  critical: "expirada",
  success: "vigente",
};

const ICON: Record<AuditSeverity, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
  success: CheckCircle2,
};

export function AuditSeverityBadge({ severity, withIcon = true }: Props) {
  const Icon = ICON[severity];
  return (
    <Badge variant={VARIANT[severity]} className="gap-1">
      {withIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {auditStrings.severity[severity]}
    </Badge>
  );
}
