/**
 * F-09 · Admin Audit — types (mock contract for backend handoff).
 */

export type AuditSeverity = "info" | "warning" | "critical" | "success";

export type AuditModule =
  | "catalog"
  | "companies"
  | "billing"
  | "licenses"
  | "access"
  | "pricing"
  | "auth"
  | "system";

export type AuditActorType = "super_admin" | "system";

export interface AuditDiffField {
  field: string;
  before: string | number | null;
  after: string | number | null;
}

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO
  severity: AuditSeverity;
  module: AuditModule;
  action: string;
  actorType: AuditActorType;
  actorName: string;
  actorEmail: string;
  resourceType: string;
  resourceLabel: string;
  resourceId: string;
  ip: string;
  userAgent: string;
  sessionId: string;
  reviewed: boolean;
  isCritical?: boolean;
  diff?: AuditDiffField[];
  notes?: string;
}

export type AuditDateRange = "24h" | "7d" | "30d" | "all";

export interface AuditFiltersState {
  search: string;
  severity: "all" | AuditSeverity;
  module: "all" | AuditModule;
  range: AuditDateRange;
  onlyCritical: boolean;
  onlyUnreviewed: boolean;
}

export const AUDIT_DEFAULT_FILTERS: AuditFiltersState = {
  search: "",
  severity: "all",
  module: "all",
  range: "7d",
  onlyCritical: false,
  onlyUnreviewed: false,
};
