/**
 * Dashboard endpoints — wired to the real backend.
 *
 * Mapping:
 *   getOverview()         → GET /metrics/overview
 *   getTopTracks()        → GET /metrics/top-tracks
 *   getRecentActivity()   → GET /metrics/recent-activity  (stub if missing)
 *   getAlertsSummary()    → GET /monitoring/alerts         (stub if missing)
 */

import { http } from "@/api/http";
import type {
  DashboardOverview,
  TopTrack,
  RecentActivityItem,
  AlertsSummary,
} from "@/api/types";

// ─── Adapters ─────────────────────────────────────────────────────────────────

function mapOverview(d: Record<string, unknown>): DashboardOverview {
  return {
    totalLicensesIssued: Number(d.total_licenses_issued ?? 0),
    licensesThisPeriod: Number(d.licenses_this_period ?? 0),
    totalRevenueUSD: Number(d.total_revenue_usd ?? 0),
    revenueThisPeriod: Number(d.revenue_this_period ?? 0),
    tracksMonitored: Number(d.tracks_monitored ?? 0),
    activeSocialAccounts: Number(d.active_social_accounts ?? 0),
    pendingAlerts: Number(d.pending_alerts ?? 0),
    licensesChangePercent: Number(d.licenses_change_percent ?? 0),
    revenueChangePercent: Number(d.revenue_change_percent ?? 0),
  };
}

function mapTopTrack(t: Record<string, unknown>): TopTrack {
  return {
    trackId: String(t.track_id ?? t.id),
    title: String(t.title ?? ""),
    artist: String(t.artist ?? ""),
    coverUrl: t.cover_url ? String(t.cover_url) : "",
    licensesCount: Number(t.licenses_count ?? 0),
    revenueUSD: Number(t.revenue_usd ?? 0),
    rank: Number(t.rank ?? 0),
  };
}

function mapActivityItem(item: Record<string, unknown>): RecentActivityItem {
  return {
    id: String(item.id),
    type: (item.type ?? "license_issued") as RecentActivityItem["type"],
    description: String(item.description ?? ""),
    timestamp: String(item.timestamp ?? item.created_at ?? new Date().toISOString()),
    metadata: (item.metadata as Record<string, unknown>) ?? null,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const dashboardApi = {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const res = await http.get("/metrics/overview");
      return mapOverview(res.data as Record<string, unknown>);
    } catch {
      return mapOverview({});
    }
  },

  async getTopTracks(limit: number = 5): Promise<TopTrack[]> {
    try {
      const res = await http.get("/metrics/top-tracks", { params: { limit } });
      // Backend returns { items: [...] } shape
      const data = res.data as Record<string, unknown>;
      const items = Array.isArray(data) ? data : (data.items as Record<string, unknown>[]) ?? [];
      return items.map(mapTopTrack);
    } catch {
      // Endpoint may not exist in backend — return empty array gracefully.
      return [];
    }
  },

  async getRecentActivity(limit: number = 10): Promise<RecentActivityItem[]> {
    try {
      const res = await http.get("/metrics/recent-activity", { params: { limit } });
      // Backend returns { items: [...], next_cursor: null } shape
      const data = res.data as Record<string, unknown>;
      const items = Array.isArray(data) ? data : (data.items as Record<string, unknown>[]) ?? [];
      return items.map(mapActivityItem);
    } catch {
      return [];
    }
  },

  async getAlertsSummary(): Promise<AlertsSummary> {
    try {
      const res = await http.get("/monitoring/alerts", { params: { limit: 5 } });
      const raw = res.data;
      const items: Record<string, unknown>[] = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as Record<string, unknown>)?.results)
          ? ((raw as Record<string, unknown>).results as Record<string, unknown>[])
          : Array.isArray((raw as Record<string, unknown>)?.items)
            ? ((raw as Record<string, unknown>).items as Record<string, unknown>[])
            : [];
      return {
        total: items.length,
        critical: items.filter((a) => a.severity === "critical").length,
        warning: items.filter((a) => a.severity === "warning").length,
        info: items.filter((a) => a.severity === "info").length,
        items: items.slice(0, 5).map((a) => ({
          id: String(a.id),
          severity: (a.severity ?? "info") as AlertsSummary["items"][number]["severity"],
          message: String(a.message ?? ""),
          createdAt: String(a.created_at ?? new Date().toISOString()),
          acknowledged: Boolean(a.acknowledged ?? false),
        })),
      };
    } catch {
      return { total: 0, critical: 0, warning: 0, info: 0, items: [] };
    }
  },
};
