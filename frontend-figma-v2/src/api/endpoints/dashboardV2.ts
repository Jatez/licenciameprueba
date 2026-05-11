/**
 * Dashboard V2 endpoints — wired to the real backend.
 *
 * Mapping:
 *   getDashboardDataV2() → GET /metrics/overview  (backend has overview, we enrich to V2 shape)
 *
 * Note: The V2 dashboard was originally a rich mock with fixtures (default/lowBalance/newCompany).
 * In production we use real data from /metrics/overview; fixture support is kept for DEV mode.
 */

import { http } from "@/api/http";
import type {
  DashboardDataV2,
  DashboardPeriod,
  DashboardPeriodRange,
  CreditUsageSeries,
  LicenseSummaryV2,
  WalletV2,
} from "../types.dashboard";

function buildPeriodRange(period: DashboardPeriod): DashboardPeriodRange {
  const now = new Date();
  const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const from = new Date(now.getTime() - periodDays * 86_400_000);
  const comparedFrom = new Date(from.getTime() - periodDays * 86_400_000);
  return {
    preset: period,
    from: from.toISOString(),
    to: now.toISOString(),
    comparedFrom: comparedFrom.toISOString(),
    comparedTo: from.toISOString(),
  };
}

// Build a DashboardDataV2 from the metrics/overview response.
function buildFromOverview(d: Record<string, unknown>, period: DashboardPeriod): DashboardDataV2 {
  const now = new Date().toISOString();

  // Backend fields: credits_available, credits_total, credits_used
  const balance = Number(d.credits_available ?? d.available_credits ?? 0);
  const totalPurchased = Number(d.credits_total ?? d.total_credits ?? 0);
  const consumedInPeriod = Number(d.credits_used ?? d.credits_consumed_this_period ?? 0);

  const wallet: WalletV2 = {
    balance,
    totalPurchased,
    consumedInPeriod,
    expiresAt: d.expires_at ? String(d.expires_at) : null,
    daysUntilExpiry: d.days_until_expiry ? Number(d.days_until_expiry) : null,
    lowBalanceThreshold: Number(d.low_balance_threshold ?? 30),
    expiryWarningDays: Number(d.expiry_warning_days ?? 60),
  };

  const licenseSummary: LicenseSummaryV2 = {
    active: Number(d.active_licenses ?? 0),
    consumed: Number(d.consumed_licenses ?? 0),
    expired: Number(d.expired_licenses ?? 0),
    cancelled: Number(d.cancelled_licenses ?? 0),
    needsReview: Number(d.needs_review_licenses ?? 0),
    totalIssuedInPeriod: Number(d.licenses_this_period ?? d.total_licenses_issued ?? 0),
  };

  const creditUsage: CreditUsageSeries = {
    points: Array.isArray(d.credit_usage_points)
      ? (d.credit_usage_points as CreditUsageSeries["points"])
      : [],
    periodTotal: consumedInPeriod,
    periodAverage: 0,
    previousPeriodTotal: 0,
    previousPeriodAverage: 0,
  };

  return {
    period: buildPeriodRange(period),
    wallet,
    kpis: [],
    creditUsage,
    licenseSummary,
    topTracks: Array.isArray(d.top_tracks)
      ? (d.top_tracks as DashboardDataV2["topTracks"])
      : [],
    platformMetrics: Array.isArray(d.accounts_by_platform)
      ? (d.accounts_by_platform as DashboardDataV2["platformMetrics"])
      : [],
    recentActivity: Array.isArray(d.recent_activity)
      ? (d.recent_activity as DashboardDataV2["recentActivity"])
      : [],
    userActivity: Array.isArray(d.user_activity)
      ? (d.user_activity as DashboardDataV2["userActivity"])
      : [],
    alerts: [],
    freshness: {
      lastSyncAt: String(d.generated_at ?? now),
      syncStatus: "fresh",
    },
  };
}

export async function getDashboardDataV2(
  period: DashboardPeriod = "30d",
  fixture: string = "default",
): Promise<DashboardDataV2> {
  // In development, allow fixture override for testing edge cases via mock files.
  if (import.meta.env.DEV && fixture !== "default") {
    const { buildDefaultMock, buildLowBalanceMock, buildNewCompanyMock } = await import(
      "../mocks/dashboardV2.mocks"
    );
    switch (fixture) {
      case "newCompany":
        return buildNewCompanyMock();
      case "lowBalance":
        return buildLowBalanceMock();
      case "error":
        throw new Error("DASHBOARD_LOAD_FAILED: No pudimos cargar tu dashboard");
    }
    return buildDefaultMock(period as DashboardPeriod);
  }

  const [overviewRes, alertsRes] = await Promise.allSettled([
    http.get("/metrics/overview"),
    http.get("/monitoring/alerts", { params: { limit: 10 } }),
  ]);

  const overviewData =
    overviewRes.status === "fulfilled"
      ? (overviewRes.value.data as Record<string, unknown>)
      : {};

  const rawAlerts: Record<string, unknown>[] =
    alertsRes.status === "fulfilled"
      ? (() => {
          const d = alertsRes.value.data;
          return Array.isArray(d)
            ? (d as Record<string, unknown>[])
            : Array.isArray((d as Record<string, unknown>)?.results)
              ? ((d as Record<string, unknown>).results as Record<string, unknown>[])
              : Array.isArray((d as Record<string, unknown>)?.items)
                ? ((d as Record<string, unknown>).items as Record<string, unknown>[])
                : [];
        })()
      : [];

  const alerts: import("../types.dashboard").DashboardAlert[] = rawAlerts.map((a) => ({
    id: String(a.id),
    severity: (a.severity ?? "info") as import("../types.dashboard").AlertSeverity,
    type: (a.type ?? a.alert_type ?? "needs-review") as import("../types.dashboard").DashboardAlertType,
    title: String(a.title ?? a.message ?? "Alerta"),
    message: String(a.message ?? a.description ?? ""),
    ctaLabel: a.cta_label ? String(a.cta_label) : undefined,
    ctaRoute: a.cta_route ? String(a.cta_route) : undefined,
    dismissible: Boolean(a.dismissible ?? true),
  }));

  try {
    const data = buildFromOverview(overviewData, period);
    return { ...data, alerts };
  } catch {
    return { ...buildFromOverview({}, period), alerts };
  }
}
