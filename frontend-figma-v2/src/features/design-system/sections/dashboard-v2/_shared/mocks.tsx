import { ArrowDownRight, ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers visuales reutilizables para los specs de dashboard-v2.
 * Pensados para mantener mocks pequeños y consistentes con DashboardHeaderSection.
 * No deben importarse fuera de /sections/dashboard-v2/.
 * ────────────────────────────────────────────────────────────────────────── */

export function MiniCard({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-3 text-xs",
        dark ? "border-transparent bg-foreground text-background" : "border-border bg-card text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MiniDelta({ percent }: { percent: number }) {
  const positive = percent > 0;
  const negative = percent < 0;
  const Icon = positive ? ArrowUpRight : negative ? ArrowDownRight : ArrowRight;
  const sign = positive ? "+" : negative ? "−" : "";
  const tone = positive
    ? "bg-success-subtle text-foreground"
    : negative
      ? "bg-error-subtle text-foreground"
      : "bg-muted text-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium font-tnum",
        tone,
      )}
    >
      <Icon className="h-2.5 w-2.5" aria-hidden="true" />
      {sign}
      {Math.abs(percent)}%
    </span>
  );
}

/** Sparkline simulado con divs — barato y suficiente para mocks visuales. */
export function MiniSpark({
  values,
  color = "currentColor",
}: {
  values: number[];
  color?: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-8 w-full items-end gap-0.5" aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-sm"
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, background: color, opacity: 0.7 }}
        />
      ))}
    </div>
  );
}

/** Mini KPI card estática para mocks de variants/states. */
export function MiniKpi({
  label,
  value,
  unit,
  delta,
  trend,
  icon: Icon,
  dark = false,
  highlighted = false,
  cta = "Ver →",
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  trend?: number[];
  icon?: LucideIcon;
  dark?: boolean;
  highlighted?: boolean;
  cta?: string;
}) {
  const labelColor = dark ? "text-background/60" : "text-muted-foreground";
  const valueColor = dark ? "text-background" : "text-foreground";
  const sparkColor = dark ? "hsl(var(--background))" : "hsl(var(--foreground))";

  return (
    <MiniCard dark={dark} className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {highlighted && <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />}
        {Icon && <Icon className={cn("h-3 w-3", labelColor)} aria-hidden="true" />}
        <span className={cn("text-[10px] font-medium uppercase tracking-wider", labelColor)}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-xl font-bold leading-none font-tnum", valueColor)}>{value}</span>
        {delta != null && <MiniDelta percent={delta} />}
      </div>
      {unit && <p className={cn("text-[10px]", labelColor)}>{unit}</p>}
      {trend && <MiniSpark values={trend} color={sparkColor} />}
      <span className={cn("text-[10px] font-medium underline-offset-2", valueColor)}>{cta}</span>
    </MiniCard>
  );
}

/** Mini progress bar (countdown) con tono semántico. */
export function MiniCountdown({
  daysLeft,
  totalDays,
  dark = false,
}: {
  daysLeft: number;
  totalDays: number;
  dark?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));
  const barColor =
    daysLeft >= 30 ? "bg-success" : daysLeft >= 7 ? "bg-warning" : "bg-destructive";
  const trackColor = dark ? "bg-background/15" : "bg-muted";
  const textColor = dark ? "text-background/70" : "text-muted-foreground";
  return (
    <div className="flex flex-col gap-1">
      <div className={cn("h-1.5 w-full rounded-full", trackColor)}>
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-[10px] font-tnum", textColor)}>
        {daysLeft} / {totalDays} días
      </span>
    </div>
  );
}

/** Anillo SVG simplificado para WalletProgressRing. */
export function MiniRing({
  value,
  total,
  size = 64,
}: {
  value: number;
  total: number;
  size?: number;
}) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, total) / total) * circumference;

  return (
    <svg width={size} height={size} role="img" aria-label={`${value} de ${total}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--color-black) / 0.15)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--color-black))"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/** Mini stacked bar chart — para mocks del CreditUsageChart. */
export function MiniStackedBars({
  bars,
}: {
  bars: Array<Array<{ value: number; color: string }>>;
}) {
  const totals = bars.map((stack) => stack.reduce((a, b) => a + b.value, 0));
  const max = Math.max(...totals, 1);
  return (
    <div className="flex h-20 w-full items-end gap-1" aria-hidden="true">
      {bars.map((stack, i) => {
        const total = totals[i];
        const heightPct = (total / max) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col-reverse" style={{ height: `${heightPct}%` }}>
            {stack.map((seg, j) => {
              const segPct = total > 0 ? (seg.value / total) * 100 : 0;
              const isTop = j === stack.length - 1;
              return (
                <span
                  key={j}
                  style={{
                    height: `${segPct}%`,
                    background: seg.color,
                    borderTopLeftRadius: isTop ? 3 : 0,
                    borderTopRightRadius: isTop ? 3 : 0,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
