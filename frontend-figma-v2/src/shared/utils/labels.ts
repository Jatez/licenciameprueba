/**
 * Domain status → user-visible label + Badge variant mappings.
 * Single source of truth so badges, tables and filters never drift.
 */
import type { LicenseStatusFull, UserRole } from "@/api/types";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "vigente"
  | "consumida"
  | "expirada"
  | "pendiente"
  | "info"
  | "metric";

export type MonitoringStatus =
  | "matched_usage"
  | "manual_review"
  | "unmatched"
  | "disputed";

export interface BadgeMapping {
  label: string;
  variant: BadgeVariant;
}

const LICENSE_STATUS: Record<LicenseStatusFull, BadgeMapping> = {
  active: { label: "Vigente", variant: "vigente" },
  consumed: { label: "Consumida", variant: "consumida" },
  expired: { label: "Expirada", variant: "expirada" },
  cancelled: { label: "Anulada", variant: "secondary" },
};

const MONITORING_STATUS: Record<MonitoringStatus, BadgeMapping> = {
  matched_usage: { label: "Uso identificado", variant: "vigente" },
  manual_review: { label: "Revisión manual", variant: "pendiente" },
  unmatched: { label: "Sin coincidencia", variant: "secondary" },
  disputed: { label: "En disputa", variant: "expirada" },
};

const ROLE: Record<UserRole, string> = {
  company_admin: "Admin de empresa",
  manager: "Manager",
  creator: "Creador",
  auditor: "Auditor",
  super_admin: "Super admin",
};

export const licenseStatusLabel = (s: LicenseStatusFull): BadgeMapping => LICENSE_STATUS[s];
export const monitoringStatusLabel = (s: MonitoringStatus): BadgeMapping => MONITORING_STATUS[s];
export const roleLabel = (r: UserRole): string => ROLE[r];