import { useMemo } from "react";
import {
  AdminPageTitle,
  AdminSectionTitle,
  AdminMetricCard,
  AdminAlertCard,
  AdminQuickActionCard,
  adminAlertsMock,
  adminQuickActionsMock,
  adminStrings,
} from "@/modules/admin";
import type { AdminMetricMock } from "@/modules/admin";
import { useAdminStats } from "@/modules/admin/hooks/useAdminStats";

/**
 * F-09 Overview — global Super Admin dashboard.
 * Metrics wired to GET /admin/stats. Alerts and quick-actions remain mock
 * until a dedicated alerting endpoint is available.
 */
export default function AdminDashboard() {
  const t = adminStrings.overview;
  const { stats, isLoading } = useAdminStats();

  // Build metric cards from real stats, falling back to 0 while loading
  const realMetrics = useMemo<AdminMetricMock[]>(() => {
    return [
      {
        key: "activeCompanies",
        value: stats ? String(stats.total_companies) : "—",
        unit: "organizaciones",
        trend: [],
        delta: { value: 0, percent: 0, sentiment: "neutral" },
      },
      {
        key: "catalogTracks",
        value: stats ? String(stats.active_tracks) : "—",
        unit: "tracks activos",
        trend: [],
        delta: { value: 0, percent: 0, sentiment: "neutral" },
      },
      {
        key: "creditsSold",
        value: stats ? String(stats.active_packages) : "—",
        unit: "paquetes activos",
        trend: [],
        delta: { value: 0, percent: 0, sentiment: "neutral" },
      },
      {
        key: "licensesIssued",
        value: stats ? String(stats.total_users) : "—",
        unit: "usuarios totales",
        trend: [],
        delta: { value: 0, percent: 0, sentiment: "neutral" },
      },
    ];
  }, [stats]);

  return (
    <>
      <AdminPageTitle title={t.pageTitle} subtitle={t.pageSubtitle} />

      <section aria-labelledby="admin-metrics-heading" className="pb-10">
        <AdminSectionTitle title={t.metricsHeading} hint={t.metricsHint} />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando estadísticas…</p>
        ) : (
          <div
            id="admin-metrics-heading"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {realMetrics.map((metric) => (
              <AdminMetricCard key={metric.key} metric={metric} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="admin-alerts-heading" className="pb-10">
        <AdminSectionTitle title={t.alertsHeading} hint={t.alertsHint} />
        <div
          id="admin-alerts-heading"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {adminAlertsMock.map((alert) => (
            <AdminAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      <section aria-labelledby="admin-quick-actions-heading" className="pb-4">
        <AdminSectionTitle title={t.quickActionsHeading} hint={t.quickActionsHint} />
        <div
          id="admin-quick-actions-heading"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
        >
          {adminQuickActionsMock.map((action) => (
            <AdminQuickActionCard key={action.key} action={action} />
          ))}
        </div>
      </section>
    </>
  );
}
