import { useMemo } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type KPIDeltaSentiment = "positive" | "negative" | "neutral";

export interface KPIDelta {
  /** Absolute value of the change (e.g. 25 credits). */
  value: number;
  /** Percent change (e.g. -12). Sign drives the arrow direction. */
  percent: number;
  /** Period label e.g. "vs período anterior". */
  period: string;
  /** Color tint. Defaults to neutral. */
  sentiment?: KPIDeltaSentiment;
}

export interface KPICountdown {
  daysLeft: number;
  totalDays: number;
}

export type KPIFillPattern = "gradient" | "stripes" | "solid";
export type KPIAppearance = "light" | "dark";

export interface KPICardProps {
  label: string;
  value: number | string;
  unit?: string;
  delta?: KPIDelta;
  trend?: number[];
  variant?: "metric" | "countdown";
  countdown?: KPICountdown;
  icon?: LucideIcon;
  ctaLabel?: string;
  ctaRoute?: string;
  onCtaClick?: () => void;
  isLoading?: boolean;
  isHighlighted?: boolean;
  ariaLabel?: string;
  /** Color used by the sparkline (CSS color value). Defaults to foreground. */
  sparklineColor?: string;
  /** Visual texture of the sparkline area fill. Defaults to gradient. */
  fillPattern?: KPIFillPattern;
  /** Light (default) renders on bg-card. Dark renders on bg-foreground. */
  appearance?: KPIAppearance;
  className?: string;
}

// ─── Internal: StatDelta ─────────────────────────────────────────────────────

const sentimentChip: Record<KPIDeltaSentiment, string> = {
  positive: "bg-success-subtle text-foreground",
  negative: "bg-error-subtle text-foreground",
  neutral: "bg-muted text-foreground",
};

function StatDelta({ delta }: { delta: KPIDelta }) {
  const sentiment = delta.sentiment ?? "neutral";
  const direction = delta.percent > 0 ? "up" : delta.percent < 0 ? "down" : "flat";
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const sign = direction === "up" ? "+" : direction === "down" ? "−" : "";
  const absPercent = Math.abs(delta.percent);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium font-tnum",
        sentimentChip[sentiment],
      )}
      aria-label={`Cambio: ${sign}${Math.abs(delta.value)}, ${sign}${absPercent}%`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>
        {sign}
        {absPercent}%
      </span>
    </span>
  );
}

// ─── Internal: Sparkline (recharts) ──────────────────────────────────────────

interface SparklineProps {
  values: number[];
  color: string;
  ariaLabel: string;
}

function MetricSparkline({
  values,
  color,
  ariaLabel,
  fillPattern = "gradient",
}: SparklineProps & { fillPattern?: KPIFillPattern }) {
  const data = useMemo(() => values.map((v, i) => ({ index: i, value: v })), [values]);
  const uid = useMemo(() => Math.random().toString(36).slice(2, 9), []);
  const gradientId = `kpi-spark-grad-${uid}`;
  const stripesId = `kpi-spark-stripes-${uid}`;

  if (!values.length) {
    return <div className="h-16 w-full rounded bg-muted" aria-hidden="true" />;
  }

  const fillUrl =
    fillPattern === "stripes"
      ? `url(#${stripesId})`
      : fillPattern === "solid"
        ? color
        : `url(#${gradientId})`;

  return (
    <div className="h-16 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <pattern
              id={stripesId}
              patternUnits="userSpaceOnUse"
              width={6}
              height={6}
              patternTransform="rotate(45)"
            >
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={6}
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
            </pattern>
          </defs>
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.3, strokeDasharray: "2 2" }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "4px 8px",
            }}
            labelFormatter={(idx) => `Día ${Number(idx) + 1}`}
            formatter={(v: number) => [v, "Valor"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={fillUrl}
            fillOpacity={fillPattern === "solid" ? 0.15 : 1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Internal: Countdown Progress ────────────────────────────────────────────

function CountdownProgress({
  countdown,
  forcedBarClass,
  labelClassName,
}: {
  countdown: KPICountdown;
  forcedBarClass?: string;
  labelClassName?: string;
}) {
  const { daysLeft, totalDays } = countdown;
  const safeLeft = Math.max(0, daysLeft);
  const percent = totalDays > 0 ? Math.min(100, (safeLeft / totalDays) * 100) : 0;

  const dynamicColor =
    safeLeft >= 30
      ? "[&>div]:bg-success"
      : safeLeft >= 7
        ? "[&>div]:bg-warning"
        : "[&>div]:bg-destructive";

  const barColor = forcedBarClass ?? dynamicColor;

  return (
    <div className="flex h-16 flex-col justify-center gap-1.5">
      <Progress
        value={percent}
        aria-valuenow={safeLeft}
        aria-valuemax={totalDays}
        aria-valuemin={0}
        aria-label={`${safeLeft} de ${totalDays} días restantes`}
        className={cn("h-2 bg-muted", barColor)}
      />
      <p className={cn("text-xs text-muted-foreground font-tnum", labelClassName)}>
        {safeLeft} / {totalDays} días
      </p>
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col gap-2.5 rounded-card p-5", className)}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-3 w-20" />
    </Card>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function KPICard({
  label,
  value,
  unit,
  delta,
  trend,
  variant = "metric",
  countdown,
  icon: Icon,
  ctaLabel,
  ctaRoute,
  onCtaClick,
  isLoading,
  isHighlighted,
  ariaLabel,
  sparklineColor = "hsl(var(--foreground))",
  fillPattern = "gradient",
  appearance = "light",
  className,
}: KPICardProps) {
  if (isLoading) return <KPICardSkeleton className={className} />;

  const isDark = appearance === "dark";

  // On dark surfaces the foreground stroke disappears — invert to background.
  const effectiveStroke =
    isDark && sparklineColor === "hsl(var(--foreground))"
      ? "hsl(var(--background))"
      : sparklineColor;

  const computedAriaLabel =
    ariaLabel ??
    `${label}: ${value}${unit ? ` ${unit}` : ""}${
      delta ? ` (${delta.percent > 0 ? "+" : ""}${delta.percent}% ${delta.period})` : ""
    }`;

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCtaClick) onCtaClick();
  };

  const isClickable = !!onCtaClick && !ctaLabel;

  return (
    <Card
      role="article"
      aria-label={computedAriaLabel}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onCtaClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" && onCtaClick) onCtaClick();
            }
          : undefined
      }
      className={cn(
        "group flex flex-col gap-2.5 rounded-card p-5 transition-all",
        isDark
          ? "border-transparent bg-foreground text-background"
          : "border-border bg-card",
        (isClickable || onCtaClick) &&
          "cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Row 1: icon + label */}
      <div className="flex items-center gap-2">
        {isHighlighted && (
          <span
            className="inline-flex h-2 w-2 rounded-full bg-warning"
            aria-label="Atención"
          />
        )}
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4",
              isDark ? "text-background/60" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
        )}
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            isDark ? "text-background/60" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      </div>

      {/* Row 2: value + delta */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={cn(
            "text-[2.45rem] font-bold leading-none font-tnum lg:text-[2.7rem]",
            isDark ? "text-background" : "text-foreground",
          )}
        >
          {value}
        </span>
        {delta && <StatDelta delta={delta} />}
      </div>

      {/* Row 3: unit (always own line) */}
      {unit && (
        <p
          className={cn(
            "text-sm",
            isDark ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {unit}
        </p>
      )}

      {/* Row 4: sparkline OR countdown */}
      {variant === "metric" && trend && trend.length > 0 && (
        <MetricSparkline
          values={trend}
          color={effectiveStroke}
          fillPattern={fillPattern}
          ariaLabel={`Tendencia de ${label}`}
        />
      )}
      {variant === "countdown" && countdown && (
        <CountdownProgress
          countdown={countdown}
          forcedBarClass={isDark ? "[&>div]:bg-background" : "[&>div]:bg-foreground"}
          labelClassName={isDark ? "text-background/70" : undefined}
        />
      )}

      {/* Row 5: CTA */}
      {ctaLabel && (
        <Button
          variant="link"
          size="sm"
          className={cn(
            "h-auto justify-start p-0 hover:no-underline group-hover:underline",
            isDark
              ? "text-background hover:text-background/80"
              : "text-foreground",
          )}
          onClick={handleCtaClick}
          asChild={!!ctaRoute}
        >
          {ctaRoute ? (
            <a href={ctaRoute}>
              <span className="inline-flex items-center gap-1">
                {ctaLabel}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1">
              {ctaLabel}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          )}
        </Button>
      )}
    </Card>
  );
}
