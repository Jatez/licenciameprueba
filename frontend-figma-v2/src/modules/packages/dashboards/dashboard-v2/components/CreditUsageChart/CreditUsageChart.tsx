import { useId, useMemo, useState } from "react";
import { Inbox, ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/modules/packages/dashboards/dashboard/components/EmptyState/EmptyState";
import type { CreditUsageSeries, LicenseUsageType } from "@/api/types.dashboard";
import { dashboardV2Strings, fmt } from "../../strings";
import { CreditUsageLegend, USAGE_TYPE_COLORS, USAGE_TYPE_ORDER } from "./CreditUsageLegend";
import { CreditUsageTooltip } from "./CreditUsageTooltip";

interface CreditUsageChartProps {
  data: CreditUsageSeries;
  isLoading?: boolean;
}

type FillTexture = "gradient" | "solid" | "lines" | "dots";

/**
 * Texturas rotan por orden visual de la serie (no por type).
 * Garantiza que series adyacentes nunca compartan textura.
 */
const TEXTURE_BY_INDEX: FillTexture[] = ["gradient", "solid", "lines", "dots"];

const xFormatter = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });

export function CreditUsageChart({ data, isLoading }: CreditUsageChartProps) {
  const t = dashboardV2Strings.creditUsage;
  const uid = useId().replace(/:/g, "");
  const [visible, setVisible] = useState<Record<LicenseUsageType, boolean>>(() =>
    USAGE_TYPE_ORDER.reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<LicenseUsageType, boolean>,
    ),
  );

  const chartData = useMemo(
    () =>
      data.points.map((p) => ({
        date: p.date,
        ...p.byUsageType,
      })),
    [data.points],
  );

  const todayKey = useMemo(() => {
    if (!data.points.length) return null;
    return data.points[data.points.length - 1]?.date ?? null;
  }, [data.points]);

  // Última serie visible → recibe esquinas redondeadas en el tope del stack.
  const lastVisibleType = useMemo(() => {
    for (let i = USAGE_TYPE_ORDER.length - 1; i >= 0; i--) {
      const type = USAGE_TYPE_ORDER[i];
      if (visible[type]) return type;
    }
    return null;
  }, [visible]);

  const deltaPct = data.previousPeriodTotal
    ? Math.round(((data.periodTotal - data.previousPeriodTotal) / data.previousPeriodTotal) * 100)
    : 0;
  const deltaPositive = deltaPct >= 0;
  const DeltaIcon = deltaPositive ? ArrowUpRight : ArrowDownRight;

  const fillByType = (type: LicenseUsageType, index: number): string => {
    const texture = TEXTURE_BY_INDEX[index % TEXTURE_BY_INDEX.length];
    if (texture === "solid") return USAGE_TYPE_COLORS[type];
    return `url(#cuc-${texture}-${type}-${uid})`;
  };

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col gap-4 bg-card p-6 text-foreground shadow-sm">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[260px] w-full" />
        <Skeleton className="h-4 w-full" />
      </Card>
    );
  }

  if (data.points.length === 0) {
    return (
      <Card className="flex h-full flex-col bg-card p-6 text-foreground shadow-sm">
        <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <EmptyState icon={Inbox} title={t.empty} description="" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col gap-3 bg-card p-6 text-foreground shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
        <p className="text-xs text-muted-foreground">
          {t.subtitle} · últimos {data.points.length} días
        </p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="20%">
            <desc>
              Consumo de créditos en el período: {data.periodTotal} créditos totales, promedio diario {data.periodAverage}.
            </desc>
            <defs>
              {USAGE_TYPE_ORDER.map((type) => {
                const color = USAGE_TYPE_COLORS[type];
                return (
                  <g key={type}>
                    {/* gradient: vertical, intenso arriba → suave abajo */}
                    <linearGradient
                      id={`cuc-gradient-${type}-${uid}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                    </linearGradient>
                    {/* lines: rayas diagonales */}
                    <pattern
                      id={`cuc-lines-${type}-${uid}`}
                      patternUnits="userSpaceOnUse"
                      width={6}
                      height={6}
                      patternTransform="rotate(45)"
                    >
                      <rect width={6} height={6} fill={color} fillOpacity={0.4} />
                      <line
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={6}
                        stroke={color}
                        strokeWidth={1.5}
                        strokeOpacity={0.95}
                      />
                    </pattern>
                    {/* dots: puntos sobre fondo del color */}
                    <pattern
                      id={`cuc-dots-${type}-${uid}`}
                      patternUnits="userSpaceOnUse"
                      width={6}
                      height={6}
                    >
                      <rect width={6} height={6} fill={color} fillOpacity={0.35} />
                      <circle cx={3} cy={3} r={1.2} fill={color} fillOpacity={0.95} />
                    </pattern>
                  </g>
                );
              })}
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="hsl(var(--foreground) / 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => xFormatter.format(new Date(v)).toLowerCase()}
              stroke="hsl(var(--foreground) / 0.55)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="font-tnum"
            />
            <YAxis
              stroke="hsl(var(--foreground) / 0.55)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="font-tnum"
            />
            <Tooltip
              content={<CreditUsageTooltip />}
              cursor={{ fill: "hsl(var(--foreground) / 0.06)" }}
            />
            {todayKey && (
              <ReferenceLine
                x={todayKey}
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: "hoy",
                  position: "top",
                  fill: "hsl(var(--foreground) / 0.7)",
                  fontSize: 10,
                }}
              />
            )}
            {USAGE_TYPE_ORDER.map((type, index) =>
              visible[type] ? (
                <Bar
                  key={type}
                  dataKey={type}
                  stackId="1"
                  fill={fillByType(type, index)}
                  radius={type === lastVisibleType ? [8, 8, 0, 0] : 0}
                  isAnimationActive={false}
                />
              ) : null,
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <CreditUsageLegend
        visible={visible}
        onToggle={(type) => setVisible((s) => ({ ...s, [type]: !s[type] }))}
        appearance="light"
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {fmt(t.periodTotal, { total: data.periodTotal })}
          <span className="font-tnum"></span>
        </span>
        <span aria-hidden="true">·</span>
        <span>vs período anterior</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium font-tnum ${
            deltaPositive ? "bg-metric-subtle text-primary-foreground" : "bg-error-subtle text-foreground"
          }`}
        >
          <DeltaIcon className="h-3 w-3" aria-hidden="true" />
          {deltaPositive ? "+" : ""}
          {deltaPct}%
        </span>
      </div>
    </Card>
  );
}
