import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import type { LicenseStatusFull } from "@/api/types";

interface Props {
  status: LicenseStatusFull;
  className?: string;
}

const VARIANT: Record<
  LicenseStatusFull,
  "vigente" | "consumida" | "expirada"
> = {
  active: "vigente",
  consumed: "consumida",
  expired: "expirada",
  cancelled: "expirada",
};

export function LicenseStatusBadge({ status, className }: Props) {
  const t = licensingStrings.list.statusBadge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={VARIANT[status]}
          aria-label={t[status]}
          className={className}
        >
          {t[status]}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{t.tooltip[status]}</TooltipContent>
    </Tooltip>
  );
}
