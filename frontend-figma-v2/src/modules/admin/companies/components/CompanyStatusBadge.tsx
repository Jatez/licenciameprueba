import { Badge } from "@/components/ui/badge";
import { companiesStrings } from "../strings";
import type { CompanyStatus } from "../types";

const VARIANT: Record<CompanyStatus, "vigente" | "expirada" | "pendiente"> = {
  active: "vigente",
  suspended: "expirada",
  overdue: "pendiente",
};

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  return <Badge variant={VARIANT[status]}>{companiesStrings.status[status]}</Badge>;
}
