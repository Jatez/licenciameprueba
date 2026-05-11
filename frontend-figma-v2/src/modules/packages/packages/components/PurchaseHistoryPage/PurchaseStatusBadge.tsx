import { Clock, Loader2, Shield, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PurchaseStatus } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";

type Variant = Parameters<typeof Badge>[0]["variant"];

const VARIANTS: Record<
  PurchaseStatus,
  { variant: Variant; icon?: LucideIcon; spinner?: boolean }
> = {
  draft: { variant: "secondary" },
  processing: { variant: "info", spinner: true },
  pending_payment: { variant: "pendiente", icon: Clock },
  pending: { variant: "pendiente", icon: Clock },
  pending_confirmation: { variant: "info", spinner: true },
  confirmed: { variant: "vigente" },
  rejected: { variant: "expirada", icon: XCircle },
  failed: { variant: "expirada", icon: XCircle },
  manual_review: { variant: "info", icon: Shield },
  expired: { variant: "consumida" },
};

interface Props {
  status: PurchaseStatus;
  /**
   * Optional id of an element that describes WHY the status is what it is
   * (e.g. a hidden span with the rejection reason). Wired via `aria-describedby`.
   */
  describedById?: string;
}

export function PurchaseStatusBadge({ status, describedById }: Props) {
  const config = VARIANTS[status] ?? VARIANTS.draft;
  const label = packagesStrings.history.statuses[status];
  const Icon = config.icon;
  return (
    <Badge
      variant={config.variant}
      className="gap-1"
      aria-label={packagesStrings.history.statusAria.replace("{label}", label)}
      aria-describedby={describedById}
    >
      {config.spinner ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="h-3 w-3" aria-hidden="true" />
      ) : null}
      {label}
    </Badge>
  );
}
