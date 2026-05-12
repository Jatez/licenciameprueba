/**
 * F-11 · Hook: aggregated metrics overview connected to the real backend.
 *
 * Maps GET /api/v2/metrics/overview (con date_from / date_to derivados del filter)
 * a la forma MetricsOverview que consume la vista /metricas.
 */
import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import type {
  DataHealth,
  MetricsDeltas,
  MetricsFilter,
  MetricsOverview,
  MetricsTotals,
  PlatformBreakdownEntry,
  SocialPlatform,
} from "../types";
import { resolvePeriod } from "../selectors/resolvePeriod";

interface BackendOverview {
  credits_total: number;
  credits_used: number;
  credits_blocked: number;
  credits_available: number;
  external_by_status: Record<string, number>;
  total_social_accounts: number;
  total_content_scanned: number;
  scanned_by_platform: Record<string, number>;
  publications_views: number;
  publications_likes: number;
  publications_comments: number;
  publications_shares: number;
  publications_interactions: number;
  publications_by_platform: Record<
    string,
    {
      publications: number;
      views: number;
      likes: number;
      comments: number;
      shares: number;
      interactions: number;
    }
  >;
}

interface HookResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const SUPPORTED_PLATFORMS: ReadonlySet<SocialPlatform> = new Set<SocialPlatform>(["instagram", "tiktok", "facebook"]);

function toIsoDate(iso: string): string {
  return iso.slice(0, 10);
}

function buildTotals(overview: BackendOverview): MetricsTotals {
  const publications = overview.total_content_scanned;
  const views = overview.publications_views;
  const interactions = overview.publications_interactions;
  const engagementRate = views > 0 ? Math.round((interactions / views) * 10_000) / 100 : 0;
  return {
    publications,
    views,
    interactions,
    engagementRate,
    creditsSpent: overview.credits_used,
  };
}

function computeDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 10_000) / 100;
}

function buildDeltas(current: MetricsTotals, previous: MetricsTotals): MetricsDeltas {
  return {
    publications: computeDelta(current.publications, previous.publications),
    views: computeDelta(current.views, previous.views),
    interactions: computeDelta(current.interactions, previous.interactions),
    engagementRate: computeDelta(current.engagementRate, previous.engagementRate),
    creditsSpent: computeDelta(current.creditsSpent, previous.creditsSpent),
  };
}

function buildByPlatform(overview: BackendOverview): PlatformBreakdownEntry[] {
  const out: PlatformBreakdownEntry[] = [];
  for (const [platformRaw, stats] of Object.entries(overview.publications_by_platform)) {
    if (!SUPPORTED_PLATFORMS.has(platformRaw as SocialPlatform)) continue;
    const platform = platformRaw as SocialPlatform;
    const engagementRate = stats.views > 0 ? Math.round((stats.interactions / stats.views) * 10_000) / 100 : 0;
    out.push({
      platform,
      publications: stats.publications,
      views: stats.views,
      interactions: stats.interactions,
      engagementRate,
    });
  }
  return out;
}

function buildDataHealth(overview: BackendOverview): DataHealth {
  const totalExpected = overview.total_content_scanned;
  const synced = overview.external_by_status?.["matched"] ?? 0;
  const partial = overview.external_by_status?.["manual_review"] ?? 0;
  const failed = overview.external_by_status?.["unmatched"] ?? 0;
  return {
    totalExpected,
    totalSynced: synced,
    totalPartial: partial,
    totalFailed: failed,
    lastGlobalSyncAt: new Date().toISOString(),
    isStale: false,
  };
}

async function fetchOverview(dateFrom?: string, dateTo?: string): Promise<BackendOverview> {
  const params: Record<string, string> = {};
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo) params.date_to = dateTo;
  const res = await http.get<BackendOverview>("/metrics/overview", { params });
  return res.data;
}

export function useMetricsOverview(filter: MetricsFilter): HookResult<MetricsOverview> {
  const period = resolvePeriod(filter.period, filter.customRange);
  const dateFrom = toIsoDate(period.start);
  const dateTo = toIsoDate(period.end);
  const comparisonDateFrom = toIsoDate(period.comparisonStart);
  const comparisonDateTo = toIsoDate(period.comparisonEnd);

  const queryKey = ["metrics-overview", dateFrom, dateTo, comparisonDateFrom, comparisonDateTo];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const [current, previous] = await Promise.all([
        fetchOverview(dateFrom, dateTo),
        fetchOverview(comparisonDateFrom, comparisonDateTo),
      ]);

      const totals = buildTotals(current);
      const previousTotals = buildTotals(previous);

      const overview: MetricsOverview = {
        periodStart: period.start,
        periodEnd: period.end,
        comparisonPeriodStart: period.comparisonStart,
        comparisonPeriodEnd: period.comparisonEnd,
        totals,
        deltas: buildDeltas(totals, previousTotals),
        byPlatform: buildByPlatform(current),
        dataHealth: buildDataHealth(current),
      };

      return overview;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    refetch: () => {
      void refetch();
    },
  };
}
