import { CreditCard, FileCheck, Radar, TrendingUp } from "lucide-react";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSStates,
  DSCollapsibleTokens,
  DSCollapsibleA11y,
  DSUsage,
  DSCode,
} from "../../components/spec";
import { MiniCountdown, MiniKpi } from "./_shared/mocks";

const TODAY = "2026-04-23";
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "KpiRow", desc: "Grid responsive 1/2/4 columnas que orquesta hasta 4 KPIs." },
  { name: "KpiCard", desc: "Adapter feature-side: mapea DashboardKpi → primitiva <KPICard />." },
  { name: "KPICard", desc: "Primitiva del DS (src/components/ui/kpi-card.tsx). Maneja layout, estados y temas." },
  { name: "StatDelta", desc: "Pill interna con flecha + porcentaje. Sentiment positive/negative/neutral." },
  { name: "MetricSparkline", desc: "Área recharts con fillPattern gradient/stripes/solid." },
  { name: "CountdownProgress", desc: "Barra Progress con color dinámico (verde >30d, amarillo 7-30d, rojo <7d)." },
];

const TOKENS = [
  "rounded-card",
  "p-6",
  "bg-card / bg-foreground (dark)",
  "text-foreground / text-background",
  "text-4xl / lg:text-[44px]",
  "font-bold / font-tnum",
  "text-xs uppercase tracking-wider",
  "bg-success-subtle (positive delta)",
  "bg-error-subtle (negative delta)",
  "bg-muted (neutral delta)",
  "h-2 (progress bar)",
];

const A11Y = [
  "Cada KPICard expone role=\"article\" + aria-label compuesto (label + value + delta).",
  "Sparkline con role=\"img\" + aria-label \"Tendencia de {label}\".",
  "Progress con aria-valuenow / aria-valuemax / aria-valuemin sincronizados.",
  "isHighlighted muestra dot warning con aria-label=\"Atención\".",
  "CTA navega vía onCtaClick (no submit) — nunca anidar <button> dentro de <button>.",
];

const DOS = [
  "Usar máximo 4 KPIs por fila — el grid colapsa a 2/1 columnas en breakpoints menores.",
  "Reservar appearance=\"dark\" para 1 KPI hero (en /dashboard03 es 'balance').",
  "Pasar fillPattern distinto a KPIs adyacentes para diferenciar sin romper la unidad cromática.",
  "Activar isHighlighted cuando el valor cruza un umbral semántico (saldo bajo, vigencia <30d).",
];

const DONTS = [
  "Mostrar más de 4 KPIs en una fila — el valor se vuelve ruido.",
  "Mezclar metric + countdown en sentimientos — countdown usa color dinámico de la barra, no delta.",
  "Hardcodear sparklineColor con hex — usar tokens HSL o chartColor(n).",
  "Quitar el ctaLabel — toda KPI debe ofrecer una acción siguiente.",
];

const SNIPPET = `import { KpiRow } from "@/modules/packages/dashboards/dashboard-v2/components/KpiRow";

<KpiRow
  kpis={data.kpis}
  wallet={data.wallet}
  isLoading={isLoading}
/>

// O directamente la primitiva:
import { KPICard } from "@/components/ui/kpi-card";

<KPICard
  label="Saldo de créditos"
  value={180}
  unit="créditos disponibles"
  delta={{ value: 25, percent: -12, period: "vs período anterior", sentiment: "negative" }}
  trend={[12, 14, 13, 16, 18, 17, 21]}
  variant="metric"
  appearance="dark"
  fillPattern="gradient"
  icon={CreditCard}
  ctaLabel="Comprar créditos"
  onCtaClick={() => navigate("/packages")}
/>`;

const sampleTrend = [8, 10, 9, 12, 11, 14, 13, 16, 18, 17];

const STATES = [
  {
    label: "default",
    node: <MiniKpi label="Saldo" value="180" unit="créditos" delta={-12} trend={sampleTrend} icon={CreditCard} />,
  },
  {
    label: "dark",
    className: "appearance=dark",
    node: <MiniKpi label="Saldo" value="180" unit="créditos" delta={-12} trend={sampleTrend} icon={CreditCard} dark />,
  },
  {
    label: "highlighted",
    className: "isHighlighted",
    node: <MiniKpi label="Vigencia" value="5" unit="días" trend={sampleTrend} icon={TrendingUp} highlighted />,
  },
  {
    label: "loading",
    node: (
      <div className="flex w-full flex-col gap-1.5">
        <div className="h-2 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-12 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded bg-muted" />
      </div>
    ),
  },
  {
    label: "countdown >30d",
    className: "bg-success",
    node: (
      <div className="flex w-full flex-col gap-2">
        <span className="text-[10px] uppercase text-muted-foreground">Vigencia</span>
        <span className="text-xl font-bold font-tnum">270</span>
        <MiniCountdown daysLeft={270} totalDays={365} />
      </div>
    ),
  },
  {
    label: "countdown 7-30d",
    className: "bg-warning",
    node: (
      <div className="flex w-full flex-col gap-2">
        <span className="text-[10px] uppercase text-muted-foreground">Vigencia</span>
        <span className="text-xl font-bold font-tnum">15</span>
        <MiniCountdown daysLeft={15} totalDays={365} />
      </div>
    ),
  },
  {
    label: "countdown <7d",
    className: "bg-destructive",
    node: (
      <div className="flex w-full flex-col gap-2">
        <span className="text-[10px] uppercase text-muted-foreground">Vigencia</span>
        <span className="text-xl font-bold font-tnum">3</span>
        <MiniCountdown daysLeft={3} totalDays={365} />
      </div>
    ),
  },
];

export function KpiRowSection() {
  return (
    <>
      <DSSectionHeader
        id="kpi-row"
        title={`KPI Row — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<KpiRow /> · <KpiCard /> · <KPICard />"
      />
      <DSComponentSpec description="Fila superior del dashboard v2. Hasta 4 métricas clave en grid 1/2/4. Combina la primitiva <KPICard /> del DS con el adapter <KpiCard /> que mapea el contrato DashboardKpi del backend." layout="split">
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
          href="/dashboard03"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-foreground hover:underline"
        >
          Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/dashboard03</code>
        </a>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens tokens={TOKENS} />
            </>
          }
          right={
            <>
              <DSVariants>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MiniKpi label="Saldo" value="180" unit="créditos" delta={-12} trend={sampleTrend} icon={CreditCard} dark />
            <MiniKpi label="Licencias" value="35" unit="activas" delta={8} trend={sampleTrend} icon={FileCheck} />
            <MiniKpi label="Posts" value="22" unit="rastreadas" delta={15} trend={sampleTrend} icon={Radar} />
            <div className="rounded-md border border-border bg-card p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Vigencia</span>
              </div>
              <span className="text-xl font-bold font-tnum">270</span>
              <p className="mt-1 text-[10px] text-muted-foreground">días restantes</p>
              <div className="mt-2">
                <MiniCountdown daysLeft={270} totalDays={365} />
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Layout final del dashboard: 1 KPI hero (dark) + 2 metric (light) + 1 countdown.
          </p>
        </DSVariants>
              <DSStates states={STATES} />
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
