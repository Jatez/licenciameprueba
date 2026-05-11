import { ArrowUpRight, Inbox } from "lucide-react";
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
import { MiniStackedBars } from "./_shared/mocks";

const TODAY = "2026-04-23";
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "Card", desc: "Hero dark sobre bg-foreground / text-background — único chart oscuro del dashboard." },
  { name: "Header", desc: "Título + subtítulo con conteo de días del período." },
  { name: "BarChart", desc: "Stacked bars de recharts. 1 bar por día, 6 series por usage type." },
  { name: "FillPatterns", desc: "4 texturas rotativas (gradient/solid/lines/dots) para diferenciar series adyacentes." },
  { name: "ReferenceLine", desc: "Línea vertical 'hoy' en el último día del período." },
  { name: "Legend", desc: "<CreditUsageLegend /> con switches para mostrar/ocultar cada serie." },
  { name: "Tooltip", desc: "<CreditUsageTooltip /> con desglose por type + total del día." },
  { name: "Footer", desc: "Total del período + delta vs período anterior (badge bg-metric-subtle / bg-error-subtle)." },
];

const TOKENS = [
  "bg-foreground",
  "text-background",
  "rounded-card / p-6",
  "h-[280px] (chart area)",
  "text-base / font-semibold (title)",
  "text-xs / text-background/60 (subtitle)",
  "stroke hsl(background / 0.1) (grid)",
  "barCategoryGap=20%",
  "radius=[8,8,0,0] (top of stack)",
];

const A11Y = [
  "<desc> dentro del SVG anuncia totales y promedio para lectores de pantalla.",
  "Tooltip se invoca por hover y por focus (recharts default keyboard support).",
  "Series ocultadas por la legend se reflejan en el aria-label de los switches.",
  "Colores de serie validados con WCAG AA contra el fondo bg-foreground.",
  "ReferenceLine 'hoy' incluye label visible — no depende solo de color.",
];

const DOS = [
  "Usar siempre stack alineado a la izquierda del split (lg:col-span-8).",
  "Mantener barCategoryGap entre 15-25% para legibilidad.",
  "Aplicar radius solo a la última serie visible del stack — el hook lastVisibleType ya lo calcula.",
  "Reservar la línea 'hoy' como única ReferenceLine — no agregar más anotaciones.",
];

const DONTS = [
  "Cambiar a fondo claro — el contraste de las texturas se diseñó para dark.",
  "Romper el orden USAGE_TYPE_ORDER — afecta la secuencia de texturas.",
  "Agregar más de 6 series — la legend se desborda.",
  "Mostrar tooltip persistente — confunde con la línea 'hoy'.",
];

const SNIPPET = `import { CreditUsageChart } from "@/modules/packages/dashboards/dashboard-v2/components/CreditUsageChart";

<CreditUsageChart
  data={data.creditUsage}
  isLoading={isLoading}
/>

// data.creditUsage estructura:
// {
//   points: [{ date, byUsageType: { 'single-use': 3, 'stories-pack': 2, ... } }],
//   periodTotal: 39,
//   periodAverage: 6.1,
//   previousPeriodTotal: 33,
// }`;

const sampleColors = ["#bac374", "#dbec62", "#a3a3a3", "#7280a3"];
const sampleData = Array.from({ length: 7 }).map(() => [
  { value: Math.random() * 4 + 1, color: sampleColors[0] },
  { value: Math.random() * 3 + 1, color: sampleColors[1] },
  { value: Math.random() * 2, color: sampleColors[2] },
  { value: Math.random() * 1.5, color: sampleColors[3] },
]);

function MiniChart({ dark = true }: { dark?: boolean }) {
  return (
    <div
      className={`w-full rounded-md p-3 ${dark ? "bg-foreground text-background" : "bg-card text-foreground border border-border"}`}
    >
      <p className={`text-[10px] font-semibold ${dark ? "text-background" : "text-foreground"}`}>
        Consumo de créditos
      </p>
      <p className={`text-[9px] ${dark ? "text-background/60" : "text-muted-foreground"}`}>Últimos 7 días</p>
      <div className="mt-2">
        <MiniStackedBars bars={sampleData} />
      </div>
      <div className="mt-2 flex items-center gap-1 text-[9px]">
        <span className={dark ? "text-background/60" : "text-muted-foreground"}>Total: 39</span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-metric-subtle px-1 py-0.5 text-primary-foreground">
          <ArrowUpRight className="h-2 w-2" /> +18%
        </span>
      </div>
    </div>
  );
}

const STATES = [
  { label: "with-data", node: <MiniChart /> },
  {
    label: "loading",
    node: (
      <div className="flex w-full flex-col gap-2 rounded-md bg-foreground p-3">
        <div className="h-2 w-1/2 animate-pulse rounded bg-background/20" />
        <div className="h-1.5 w-1/3 animate-pulse rounded bg-background/20" />
        <div className="mt-2 h-12 w-full animate-pulse rounded bg-background/20" />
      </div>
    ),
  },
  {
    label: "empty",
    node: (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-md bg-foreground p-3 text-background/70">
        <Inbox className="h-4 w-4" aria-hidden="true" />
        <span className="text-[10px]">Sin datos</span>
      </div>
    ),
  },
  {
    label: "single-day",
    node: (
      <div className="rounded-md bg-foreground p-3 text-background">
        <p className="text-[9px] text-background/60">1 día</p>
        <div className="mt-2">
          <MiniStackedBars bars={[sampleData[0]]} />
        </div>
      </div>
    ),
  },
  {
    label: "negative-delta",
    className: "bg-error-subtle",
    node: (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-error-subtle px-2 py-0.5 text-[10px] text-foreground">
        −12% vs anterior
      </span>
    ),
  },
];

export function CreditUsageChartSection() {
  return (
    <>
      <DSSectionHeader
        id="credit-usage-chart"
        title={`Credit Usage Chart — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<CreditUsageChart /> · <CreditUsageLegend /> · <CreditUsageTooltip />"
      />
      <DSComponentSpec description="Stacked bar chart hero del dashboard v2. Muestra el consumo diario de créditos desglosado por tipo de uso, con texturas rotativas para diferenciar series adyacentes y línea de referencia 'hoy'." layout="split">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-foreground">default (dark)</p>
              <MiniChart />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-foreground">light fallback (no usado en producción)</p>
              <MiniChart dark={false} />
            </div>
          </div>
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
