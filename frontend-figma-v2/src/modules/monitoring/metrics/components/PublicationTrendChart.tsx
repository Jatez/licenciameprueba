/**
 * F-11 · Per-publication mini trend chart.
 *
 * Generates a deterministic synthetic curve from the absolute totals so the
 * UI feels alive — backend will replace with the real `dailyMetrics`.
 */
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCompactNumber } from "@/shared/format";
import { metricsStrings } from "../strings";
import type { PublicationMetric } from "../types";

interface PublicationTrendChartProps {
  publication: PublicationMetric;
}

interface DailyPoint {
  day: string;
  views: number;
  interactions: number;
}

function buildSyntheticCurve(p: PublicationMetric): DailyPoint[] {
  const days = 14;
  // Simple decay curve normalized to total — concentrates 60% on first 3 days.
  const weights = Array.from({ length: days }, (_, i) =>
    Math.max(0.02, Math.exp(-i * 0.35) + (i === 0 ? 0.3 : 0)),
  );
  const sum = weights.reduce((a, b) => a + b, 0);
  const totalInteractions = p.likes + p.comments + p.shares + p.saves;
  return weights.map((w, i) => ({
    day: `D+${i}`,
    views: Math.round((w / sum) * p.views),
    interactions: Math.round((w / sum) * totalInteractions),
  }));
}

export function PublicationTrendChart({ publication }: PublicationTrendChartProps) {
  const points = useMemo(() => buildSyntheticCurve(publication), [publication]);
  const t = metricsStrings.publicationDetail;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <header>
        <h3 className="text-sm font-semibold text-foreground">{t.trendTitle}</h3>
        <p className="text-[11px] text-foreground/50">{t.trendCaption}</p>
      </header>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="pub-trend-views" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pub-trend-int" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--foreground))" strokeOpacity={0.08} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--foreground))", fillOpacity: 0.55, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => formatCompactNumber(v)}
              tick={{ fill: "hsl(var(--foreground))", fillOpacity: 0.55, fontSize: 10 }}
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
              formatter={(value: number, name: string) => [
                formatCompactNumber(value),
                name === "views" ? "Reproducciones" : "Interacciones",
              ]}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="hsl(var(--foreground))"
              strokeOpacity={0.55}
              strokeWidth={1.5}
              fill="url(#pub-trend-views)"
            />
            <Area
              type="monotone"
              dataKey="interactions"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              fill="url(#pub-trend-int)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
