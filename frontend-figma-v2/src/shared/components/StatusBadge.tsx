import { Badge } from "@/components/ui/badge";
import {
  licenseStatusLabel,
  monitoringStatusLabel,
  type MonitoringStatus,
} from "@/shared/utils/labels";
import type { LicenseStatusFull } from "@/api/types";

type DomainStatus = LicenseStatusFull | MonitoringStatus;

const LICENSE_KEYS = new Set<DomainStatus>(["active", "consumed", "expired", "cancelled"]);

export interface StatusBadgeProps {
  status: DomainStatus;
  className?: string;
}

/**
 * Maps a domain status to the right Badge variant + visible label.
 * Centralized so license and monitoring statuses look consistent everywhere.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const mapping = LICENSE_KEYS.has(status)
    ? licenseStatusLabel(status as LicenseStatusFull)
    : monitoringStatusLabel(status as MonitoringStatus);
  return (
    <Badge variant={mapping.variant} className={className}>
      {mapping.label}
    </Badge>
  );
}