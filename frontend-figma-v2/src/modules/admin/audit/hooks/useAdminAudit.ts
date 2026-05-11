import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "@/api/endpoints/admin";
import type { AdminAuditLogRaw } from "@/api/endpoints/admin";
import { adminAuditMocks } from "../mocks";
import { AUDIT_DEFAULT_FILTERS, type AuditEvent, type AuditFiltersState } from "../types";

const DAY = 86_400_000;

const RANGE_TO_MS: Record<AuditFiltersState["range"], number | null> = {
  "24h": 1 * DAY,
  "7d": 7 * DAY,
  "30d": 30 * DAY,
  all: null,
};

function mapAuditLog(raw: AdminAuditLogRaw): AuditEvent {
  return {
    id: String(raw.id),
    timestamp: String(raw.timestamp ?? raw.created_at ?? new Date().toISOString()),
    severity: (raw.severity ?? "info") as AuditEvent["severity"],
    module: (raw.module ?? "system") as AuditEvent["module"],
    action: String(raw.action ?? ""),
    actorType: (raw.actor_type ?? "super_admin") as AuditEvent["actorType"],
    actorName: String(raw.actor_name ?? ""),
    actorEmail: String(raw.actor_email ?? ""),
    resourceType: String(raw.resource_type ?? ""),
    resourceLabel: String(raw.resource_label ?? ""),
    resourceId: String(raw.resource_id ?? ""),
    ip: String(raw.ip ?? ""),
    userAgent: String(raw.user_agent ?? ""),
    sessionId: String(raw.session_id ?? ""),
    reviewed: Boolean(raw.reviewed ?? false),
    isCritical: Boolean(raw.is_critical ?? raw.severity === "critical"),
    diff: Array.isArray(raw.diff)
      ? (raw.diff as AuditEvent["diff"])
      : undefined,
    notes: raw.notes ? String(raw.notes) : undefined,
  };
}

export function useAdminAudit() {
  const [events, setEvents] = useState<AuditEvent[]>(adminAuditMocks);
  const [filters, setFilters] = useState<AuditFiltersState>(AUDIT_DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from real backend on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    adminApi
      .getAuditLogs(50)
      .then((raw) => {
        if (cancelled) return;
        if (raw.length > 0) {
          setEvents(raw.map(mapAuditLog));
        }
      })
      .catch(() => {
        // keep mocks on error
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resetFilters = useCallback(() => setFilters(AUDIT_DEFAULT_FILTERS), []);

  const markReviewed = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, reviewed: true } : e)));
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const rangeMs = RANGE_TO_MS[filters.range];
    const minTs = rangeMs ? Date.now() - rangeMs : 0;
    return events.filter((e) => {
      if (filters.severity !== "all" && e.severity !== filters.severity) return false;
      if (filters.module !== "all" && e.module !== filters.module) return false;
      if (filters.onlyCritical && !e.isCritical) return false;
      if (filters.onlyUnreviewed && e.reviewed) return false;
      if (rangeMs && new Date(e.timestamp).getTime() < minTs) return false;
      if (q) {
        const blob = `${e.actorName} ${e.actorEmail} ${e.resourceLabel} ${e.resourceId} ${e.action}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [events, filters]);

  const stats = useMemo(() => {
    const dayMs = Date.now() - DAY;
    const weekMs = Date.now() - 7 * DAY;
    return {
      today: events.filter((e) => new Date(e.timestamp).getTime() >= dayMs).length,
      criticalWeek: events.filter(
        (e) => e.isCritical && new Date(e.timestamp).getTime() >= weekMs,
      ).length,
      actors: new Set(events.map((e) => e.actorEmail)).size,
      unreviewed: events.filter((e) => !e.reviewed).length,
    };
  }, [events]);

  return { events, filtered, filters, setFilters, resetFilters, markReviewed, stats, isLoading };
}
