import { Badge } from "@/components/ui/badge";
import { licensesStrings } from "../strings";
import type { AdminLicenseStatus } from "../types";

const VARIANT: Record<AdminLicenseStatus, "vigente" | "consumida" | "expirada" | "pendiente" | "info"> = {
  active: "vigente",
  consumed: "consumida",
  expired: "expirada",
  cancelled: "pendiente",
  disputed: "expirada",
};

export function LicenseStatusBadge({ status }: { status: AdminLicenseStatus }) {
  return <Badge variant={VARIANT[status]}>{licensesStrings.status[status]}</Badge>;
}
