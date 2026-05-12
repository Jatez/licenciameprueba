/**
 * F-11 · TrendChart — area chart with toggleable series.
 * Two series: Publications (default) and Views. Switched via Tabs.
 *
 * Uses recharts (already in stack). Tokens only — no inline hex.
 */
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber } from "@/shared/format";
import type { PublicationMetric, MetricsFilter } from "../types";
import { buildTrendSeries } from "../selectors/buildTrendSeries";
import { metricsStrings } from "../strings";

interface TrendChartProps {
  publications: PublicationMetric[];
  filter: MetricsFilter;
  isLoading: boolean;
  /** Show "few data" caption (sparse scenario). */
  isSparse?: boolean;
}

type Series = "publications" | "views";

export function TrendChart({ publications, filter, isLoading, isSparse }: TrendChartProps) {
  const [series, setSeries] = useState<Series>("publications");
  const { points } = useMemo(
    () => buildTrendSeries(publications, filter),
    [publications, filter],
  );
  const isEmpty = points.every((p) => p.publications === 0 && p.views === 0);

  return (
    <Card className="flex h-full flex-col gap-3 p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {metricsStrings.trend.title}
        </h3>
        <Tabs
          value={series}
          onValueChange={(v) => setSeries(v as Series)}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="publications" className="text-xs">
              {metricsStrings.trend.seriesPublications}
            </TabsTrigger>
            <TabsTrigger value="views" className="text-xs">
              {metricsStrings.trend.seriesViews}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-56 w-full flex-1 md:min-h-64 lg:min-h-0">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-muted text-sm text-foreground/60">
            {metricsStrings.trend.emptyTitle}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="hsl(var(--foreground))"
                strokeOpacity={0.08}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--foreground))", fillOpacity: 0.55, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tickFormatter={(v: number) => formatCompactNumber(v)}
                tick={{ fill: "hsl(var(--foreground))", fillOpacity: 0.55, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--foreground))", strokeOpacity: 0.2, strokeDasharray: "2 2" }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "6px 10px",
                }}
                formatter={(value: number) => [
                  formatCompactNumber(value),
                  series === "publications"
                    ? metricsStrings.trend.seriesPublications
                    : metricsStrings.trend.seriesViews,
                ]}
              />
              <Area
                type="monotone"
                dataKey={series}
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                fill="url(#trend-grad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {isSparse && !isEmpty && !isLoading && (
        <p className="text-xs text-foreground/60">{metricsStrings.trend.sparseHint}</p>
      )}
    </Card>
  );
}
