import { Badge } from "@/components/ui/badge";
import { billingStrings } from "../strings";
import type { PaymentStatus } from "../types";

const VARIANT: Record<PaymentStatus, "vigente" | "pendiente" | "info" | "expirada" | "consumida"> = {
  paid: "vigente",
  pending: "pendiente",
  processing: "info",
  failed: "expirada",
  refunded: "consumida",
  disputed: "expirada",
};

export function BillingStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={VARIANT[status]}>{billingStrings.status[status]}</Badge>;
}
