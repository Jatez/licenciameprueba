import type {
  DashboardDataV2,
  DashboardPeriod,
  DashboardPeriodRange,
  UserActivity,
} from "../types.dashboard";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function isoMinutesAgo(minutes: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

const DEMO_ACTOR = { user_id: "u-001", user_name: "Camila Restrepo" };
const DEMO_ACTOR_2 = { user_id: "u-002", user_name: "Andrés Pérez" };

function buildUserActivityMock(): UserActivity[] {
  return [
    {
      id: "ua-1",
      type: "license_issued",
      actor: DEMO_ACTOR,
      payload: { license_code: "LIC-A8F3", track_title: "Verano en la ciudad" },
      created_at: isoMinutesAgo(2),
      detail_url: "/licenses/a1",
    },
    {
      id: "ua-2",
      type: "certificate_downloaded",
      actor: DEMO_ACTOR,
      payload: { license_code: "LIC-A8F3" },
      created_at: isoMinutesAgo(15),
      detail_url: "/licenses/a1",
    },
    {
      id: "ua-3",
      type: "credits_purchased",
      actor: DEMO_ACTOR_2,
      payload: { credits: 300 },
      created_at: isoMinutesAgo(180),
      detail_url: "/packages/history",
    },
    {
      id: "ua-4",
      type: "license_url_linked",
      actor: DEMO_ACTOR,
      payload: { license_code: "LIC-7D21", platform: "Instagram" },
      created_at: isoDaysAgo(1),
      detail_url: "/licenses/a4",
    },
    {
      id: "ua-5",
      type: "social_connected",
      actor: DEMO_ACTOR_2,
      payload: { platform: "Instagram", handle: "@marca.demo" },
      created_at: isoDaysAgo(1),
      detail_url: "/social",
    },
    {
      id: "ua-6",
      type: "track_favorited",
      actor: DEMO_ACTOR,
      payload: { track_title: "Latido eléctrico", artist: "Nodo Sur" },
      created_at: isoDaysAgo(2),
      detail_url: "/catalog/track/t2",
    },
    {
      id: "ua-7",
      type: "report_exported",
      actor: DEMO_ACTOR_2,
      payload: { report_name: "Resumen mensual", format: "PDF" },
      created_at: isoDaysAgo(3),
    },
    {
      id: "ua-8",
      type: "playlist_imported",
      actor: DEMO_ACTOR,
      payload: { playlist_name: "Brand sounds Q2", tracks_count: 24 },
      created_at: isoDaysAgo(4),
      detail_url: "/catalog",
    },
    {
      id: "ua-9",
      type: "license_voided",
      actor: DEMO_ACTOR_2,
      payload: { license_code: "LIC-COSTA", reason: "Cambio de campaña" },
      created_at: isoDaysAgo(5),
      detail_url: "/licenses/a7",
    },
    {
      id: "ua-10",
      type: "social_disconnected",
      actor: DEMO_ACTOR,
      payload: { platform: "Facebook", handle: "@marca.demo" },
      created_at: isoDaysAgo(6),
      detail_url: "/social",
    },
    {
      id: "ua-11",
      type: "company_updated",
      actor: DEMO_ACTOR_2,
      payload: { field: "Razón social" },
      created_at: isoDaysAgo(7),
    },
  ];
}

function buildPeriodRange(preset: DashboardPeriod): DashboardPeriodRange {
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : preset === "90d" ? 90 : 365;
  return {
    preset,
    from: isoDaysAgo(days),
    to: new Date().toISOString(),
    comparedFrom: isoDaysAgo(days * 2),
    comparedTo: isoDaysAgo(days),
  };
}

function buildUsagePoints(days: number) {
  const points = [];
  for (let i = days - 1; i >= 0; i--) {
    const total = Math.floor(2 + Math.random() * 8);
    const single = Math.floor(total * 0.3);
    const stories = Math.floor(total * 0.25);
    const monthly = Math.floor(total * 0.15);
    const longVideo = Math.floor(total * 0.1);
    const paidPost = Math.floor(total * 0.1);
    const collab = Math.max(0, total - single - stories - monthly - longVideo - paidPost);
    points.push({
      date: isoDaysAgo(i),
      total,
      byUsageType: {
        "single-use": single,
        "stories-pack": stories,
        "monthly-extended": monthly,
        "long-video": longVideo,
        "paid-post": paidPost,
        "collaborative-post": collab,
      },
    });
  }
  return points;
}

function buildSparkline(trend: "up" | "down" | "flat", base = 50): number[] {
  return Array.from({ length: 14 }, (_, i) => {
    const noise = Math.random() * 10 - 5;
    if (trend === "up") return Math.round(base + i * 2 + noise);
    if (trend === "down") return Math.round(base + (13 - i) * 2 + noise);
    return Math.round(base + noise);
  });
}

export function buildDefaultMock(period: DashboardPeriod): DashboardDataV2 {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const points = buildUsagePoints(Math.min(days, 30));
  const periodTotal = points.reduce((sum, p) => sum + p.total, 0);

  return {
    period: buildPeriodRange(period),
    wallet: {
      balance: 180,
      totalPurchased: 300,
      consumedInPeriod: periodTotal,
      expiresAt: isoDaysFromNow(270),
      daysUntilExpiry: 270,
      lowBalanceThreshold: 30,
      expiryWarningDays: 60,
    },
    kpis: [
      {
        id: "balance",
        value: 180,
        deltaValue: 25,
        deltaPercent: 12,
        direction: "down",
        sentiment: "negative",
        sparkline: buildSparkline("down", 200),
        unit: "créditos",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "active-licenses",
        value: 35,
        deltaValue: 3,
        deltaPercent: 8,
        direction: "up",
        sentiment: "positive",
        sparkline: buildSparkline("up", 25),
        unit: "licencias",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "tracked-posts",
        value: 22,
        deltaValue: 3,
        deltaPercent: 15,
        direction: "up",
        sentiment: "positive",
        sparkline: buildSparkline("up", 15),
        unit: "posts",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "bag-validity",
        value: "9 meses",
        deltaValue: 0,
        deltaPercent: 0,
        direction: "flat",
        sentiment: "neutral",
        sparkline: buildSparkline("flat", 50),
        unit: "días",
        lastUpdated: new Date().toISOString(),
      },
    ],
    creditUsage: {
      points,
      periodTotal,
      periodAverage: Math.round(periodTotal / Math.max(points.length, 1)),
      previousPeriodTotal: Math.round(periodTotal * 0.85),
      previousPeriodAverage: Math.round((periodTotal * 0.85) / Math.max(points.length, 1)),
    },
    licenseSummary: {
      active: 35,
      consumed: 12,
      expired: 4,
      cancelled: 1,
      needsReview: 3,
      totalIssuedInPeriod: 35,
    },
    topTracks: [
      {
        id: "t1",
        title: "Verano en la ciudad",
        artist: "Lúa Moreno",
        coverUrl: null,
        licensesCount: 8,
        totalImpressions: 145000,
        totalInteractions: 12400,
        creditsConsumed: 16,
        platforms: ["instagram", "tiktok"],
      },
      {
        id: "t2",
        title: "Latido eléctrico",
        artist: "Nodo Sur",
        coverUrl: null,
        licensesCount: 6,
        totalImpressions: 98000,
        totalInteractions: 8200,
        creditsConsumed: 12,
        platforms: ["tiktok", "facebook"],
      },
      {
        id: "t3",
        title: "Costa norte",
        artist: "Mariana Vélez",
        coverUrl: null,
        licensesCount: 5,
        totalImpressions: 76000,
        totalInteractions: 6300,
        creditsConsumed: 10,
        platforms: ["instagram"],
      },
      {
        id: "t4",
        title: "Cumbia sintética",
        artist: "Los Picos",
        coverUrl: null,
        licensesCount: 4,
        totalImpressions: 52000,
        totalInteractions: 4100,
        creditsConsumed: 8,
        platforms: ["instagram", "tiktok", "facebook"],
      },
      {
        id: "t5",
        title: "Madrugada limpia",
        artist: "Aire Quieto",
        coverUrl: null,
        licensesCount: 3,
        totalImpressions: 38000,
        totalInteractions: 3000,
        creditsConsumed: 6,
        platforms: ["tiktok"],
      },
    ],
    platformMetrics: [
      { platform: "instagram", postsCount: 12, impressions: 145000, interactions: 12400, connected: true, handle: "@marca.demo", sparkline: buildSparkline("up", 30) },
      { platform: "tiktok", postsCount: 7, impressions: 98000, interactions: 8200, connected: true, handle: "@marca.demo", sparkline: buildSparkline("up", 18) },
      { platform: "facebook", postsCount: 0, impressions: 0, interactions: 0, connected: false },
    ],
    recentActivity: [
      { id: "a1", type: "license-issued", title: "Licencia emitida", description: "Para \"Verano en la ciudad\"", timestamp: isoDaysAgo(0), actionRoute: "/licenses/a1", actionLabel: "Ver" },
      { id: "a2", type: "post-matched-auto", title: "LIC-A8F3 activada por publicación", description: "Auto-match con \"Cat Eyes\" en Instagram", timestamp: isoDaysAgo(0), actionRoute: "/monitoring", actionLabel: "Ver detalle" },
      { id: "a2b", type: "license-consumed-by-post", title: "LIC-A8F3 cambió a CONSUMIDA", description: "Publicación detectada en Instagram", timestamp: isoDaysAgo(0), actionRoute: "/licenses/a1", actionLabel: "Ver licencia" },
      { id: "a3", type: "credits-purchased", title: "Compra de créditos confirmada", description: "Bolsa de 300 créditos activada", timestamp: isoDaysAgo(1) },
      { id: "a3b", type: "evidence-expired", title: "Evidencia preservada — Story expiró en Instagram", description: "\"Vitamin C\" — Milkjive", timestamp: isoDaysAgo(1), actionRoute: "/monitoring", actionLabel: "Ver snapshot" },
      { id: "a4", type: "license-issued", title: "Licencia emitida", description: "Para \"Latido eléctrico\"", timestamp: isoDaysAgo(1), actionRoute: "/licenses/a4", actionLabel: "Ver" },
      { id: "a4b", type: "no-match-found", title: "Publicación detectada sin licencia asociada", description: "\"Track desconocido\" en TikTok", timestamp: isoDaysAgo(2), actionRoute: "/monitoring?filter=no-match-found", actionLabel: "Asociar manualmente" },
      { id: "a5", type: "social-account-connected", title: "Cuenta conectada", description: "Instagram @marca.demo", timestamp: isoDaysAgo(2) },
      { id: "a6", type: "post-matched-manual", title: "Asociaste publicación a LIC-7D21", description: "\"Vitamin C\" en TikTok", timestamp: isoDaysAgo(2), actionRoute: "/licenses/a1", actionLabel: "Ver detalle" },
      { id: "a7", type: "license-issued", title: "Licencia emitida", description: "Para \"Costa norte\"", timestamp: isoDaysAgo(3), actionRoute: "/licenses/a7", actionLabel: "Ver" },
      { id: "a7b", type: "post-unlinked", title: "Desvinculaste publicación de LIC-COSTA", description: "Razón: licencia equivocada", timestamp: isoDaysAgo(3), actionRoute: "/monitoring", actionLabel: "Ver monitoreo" },
      { id: "a8", type: "license-needs-review", title: "Licencia requiere revisión", description: "Trazabilidad pendiente", timestamp: isoDaysAgo(4), actionRoute: "/licenses?status=needs-review", actionLabel: "Revisar" },
      { id: "a9", type: "license-issued", title: "Licencia emitida", description: "Para \"Cumbia sintética\"", timestamp: isoDaysAgo(5), actionRoute: "/licenses/a9", actionLabel: "Ver" },
      { id: "a9b", type: "sync-error", title: "Error de sincronización con TikTok", description: "Rate limit alcanzado — reintentaremos en 5 min", timestamp: isoDaysAgo(5), actionRoute: "/social-accounts", actionLabel: "Ver redes sociales" },
      { id: "a10", type: "bag-expiring-alert", title: "Bolsa por vencer", description: "Faltan 45 días para vencimiento", timestamp: isoDaysAgo(6), actionRoute: "/packages", actionLabel: "Comprar" },
    ],
    userActivity: buildUserActivityMock(),
    alerts: [
      {
        id: "alert-bag-expiring",
        severity: "warning",
        type: "bag-expiring",
        title: "Tu bolsa está por vencer",
        message: "Tu bolsa actual vence en 45 días. Quedan 180 créditos sin usar.",
        ctaLabel: "Comprar créditos",
        ctaRoute: "/packages",
        dismissible: true,
      },
      {
        id: "alert-needs-review",
        severity: "info",
        type: "needs-review",
        title: "Licencias en revisión",
        message: "3 licencias requieren tu revisión para cerrar trazabilidad.",
        ctaLabel: "Revisar ahora",
        ctaRoute: "/licenses?status=needs-review",
        dismissible: true,
      },
    ],
    freshness: {
      lastSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      syncStatus: "fresh",
    },
  };
}

export function buildNewCompanyMock(): DashboardDataV2 {
  const base = buildDefaultMock("30d");
  return {
    ...base,
    wallet: { ...base.wallet, balance: 0, totalPurchased: 0, consumedInPeriod: 0, expiresAt: null, daysUntilExpiry: null },
    kpis: base.kpis.map((k) => ({ ...k, value: 0, deltaValue: 0, deltaPercent: 0, direction: "flat", sparkline: Array(14).fill(0) })),
    creditUsage: { points: [], periodTotal: 0, periodAverage: 0, previousPeriodTotal: 0, previousPeriodAverage: 0 },
    licenseSummary: { active: 0, consumed: 0, expired: 0, cancelled: 0, needsReview: 0, totalIssuedInPeriod: 0 },
    topTracks: [],
    platformMetrics: base.platformMetrics.map((p) => ({ ...p, postsCount: 0, impressions: 0, interactions: 0, connected: false })),
    recentActivity: [],
    userActivity: [],
    alerts: [],
  };
}

export function buildLowBalanceMock(): DashboardDataV2 {
  const base = buildDefaultMock("30d");
  return {
    ...base,
    wallet: { ...base.wallet, balance: 15, totalPurchased: 300, expiresAt: isoDaysFromNow(7), daysUntilExpiry: 7 },
    kpis: base.kpis.map((k) =>
      k.id === "balance"
        ? { ...k, value: 15, deltaValue: 165, deltaPercent: 92, direction: "down", sentiment: "negative" }
        : k.id === "bag-validity"
          ? { ...k, value: "7 días", sentiment: "negative" }
          : k,
    ),
    alerts: [
      {
        id: "alert-low-balance",
        severity: "critical",
        type: "low-balance",
        title: "Saldo bajo",
        message: "Te quedan 15 créditos. Compra más para no detener tu operación.",
        ctaLabel: "Comprar créditos",
        ctaRoute: "/packages",
        dismissible: false,
      },
      {
        id: "alert-bag-expiring-critical",
        severity: "critical",
        type: "bag-expiring",
        title: "Tu bolsa vence en 7 días",
        message: "Tu bolsa actual vence en 7 días. Quedan 15 créditos sin usar.",
        ctaLabel: "Comprar créditos",
        ctaRoute: "/packages",
        dismissible: false,
      },
    ],
  };
}
