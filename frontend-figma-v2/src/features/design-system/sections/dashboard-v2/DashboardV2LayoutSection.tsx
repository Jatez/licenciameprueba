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

const TODAY = "2026-04-23";
const VERSION = "v1.1.0";

const ANATOMY = [
  { name: "DashboardLayoutV2", desc: "Orquestador raíz. Selecciona entre error / empty / loaded según el estado de useDashboardData." },
  { name: "Sticky Header", desc: "<DashboardHeader /> envuelto en wrapper sticky -top-12 con frosted glass + Headroom." },
  { name: "AlertsSection", desc: "Banner pill con la alerta de mayor severidad — solo si activeAlerts > 0." },
  { name: "KpiRow", desc: "Grid 4 columnas (lg) con KPIs hero." },
  { name: "Split A: Chart 8/4 Wallet", desc: "Grid 12 col: <CreditUsageChart /> (col-span-8) + <WalletSection /> (col-span-4)." },
  { name: "Split B: Tracks 7/5 Platforms", desc: "Grid 12 col: <TopTracks /> (col-span-7) + <PlatformBreakdown /> (col-span-5)." },
  { name: "RecentActivity", desc: "Card full width al final, cierre del scroll." },
];

const TOKENS = [
  "flex flex-col gap-6",
  "grid-cols-1 lg:grid-cols-12",
  "gap-6 (between sections)",
  "gap-4 (between KPIs)",
  "lg:col-span-8 / lg:col-span-4 (split A)",
  "lg:col-span-7 / lg:col-span-5 (split B)",
];

const A11Y = [
  "Cada bloque expone su propio landmark (header / section).",
  "Skeletons preservan la altura — sin layout shift al cargar.",
  "Error state ofrece botón 'Reintentar' que dispara dashboard.refetch().",
  "Empty state se muestra ANTES del layout cuando isNewCompany — sin overlay.",
  "El sticky header ajusta -top-12 para permitir overscroll natural.",
];

const DOS = [
  "Mantener el orden visual: Header → Alerts → KPIs → Chart+Wallet → Tracks+Platforms → Activity.",
  "Pasar `isLoading` a TODOS los hijos — el loading es por sección, no global.",
  "Renderizar el skeleton de cada bloque (no spinner global) para consistencia.",
  "Usar useDashboardData (React Query) — nunca fetch manual con useEffect.",
];

const DONTS = [
  "Reordenar los splits — la jerarquía visual está validada con producto.",
  "Cambiar las proporciones del grid 8/4 y 7/5 — afectan la jerarquía de las cards.",
  "Mostrar overlay/spinner global mientras carga — usar skeletons por sección.",
  "Anidar otro scroll container — rompe el sticky del header (Headroom escucha window).",
];

const SNIPPET = `import { DashboardLayoutV2 } from "@/modules/packages/dashboards/dashboard-v2";

// Página /dashboard03 (única responsabilidad: renderizar el layout)
export default function Dashboard03() {
  return <DashboardLayoutV2 />;
}

// Estructura interna del layout:
<div className="flex flex-col gap-6">
  <div className="sticky -top-12 z-20 ..."> {/* frosted glass + headroom */}
    <DashboardHeader {...} />
  </div>
  {activeAlerts.length > 0 && <AlertsSection alerts={activeAlerts} />}
  <KpiRow kpis={data.kpis} wallet={data.wallet} />
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <div className="lg:col-span-8"><CreditUsageChart .../></div>
    <div className="lg:col-span-4"><WalletSection .../></div>
  </div>
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <div className="lg:col-span-7"><TopTracks .../></div>
    <div className="lg:col-span-5"><PlatformBreakdown .../></div>
  </div>
  <RecentActivity items={data.recentActivity} />
</div>`;

function GridCell({ label, span, dark = false }: { label: string; span: number; dark?: boolean }) {
  return (
    <div
      className={`flex h-12 items-center justify-center rounded text-[10px] font-medium ${
        dark ? "bg-foreground text-background" : "border border-border bg-card text-foreground"
      }`}
      style={{ gridColumn: `span ${span} / span ${span}` }}
    >
      {label}
    </div>
  );
}

function MiniLayout() {
  return (
    <div className="flex flex-col gap-1.5">
      <GridCell label="Sticky Header (frosted glass)" span={12} dark />
      <GridCell label="Alerts (cuando aplica)" span={12} />
      <div className="grid grid-cols-12 gap-1.5">
        <GridCell label="KPI" span={3} dark />
        <GridCell label="KPI" span={3} />
        <GridCell label="KPI" span={3} />
        <GridCell label="KPI" span={3} />
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        <GridCell label="Chart" span={8} dark />
        <GridCell label="Wallet" span={4} />
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        <GridCell label="Top Tracks" span={7} />
        <GridCell label="Platforms" span={5} />
      </div>
      <GridCell label="Recent Activity" span={12} />
    </div>
  );
}

const STATES = [
  { label: "default", className: "with data", node: <MiniLayout /> },
  {
    label: "empty company",
    node: (
      <div className="flex h-20 w-full flex-col items-center justify-center rounded border border-dashed border-border bg-card text-[10px] text-muted-foreground">
        <span className="font-semibold">Empty State V2</span>
        <span>Saludo + 3 steps</span>
      </div>
    ),
  },
  {
    label: "error",
    node: (
      <div className="flex h-20 w-full flex-col items-center justify-center rounded border border-error bg-error-subtle text-[10px] text-foreground">
        <span className="font-semibold">⚠ Error</span>
        <span>Reintentar</span>
      </div>
    ),
  },
  {
    label: "loading",
    node: (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    ),
  },
];

export function DashboardV2LayoutSection() {
  return (
    <>
      <DSSectionHeader
        id="dashboard-v2-layout"
        title={`Dashboard V2 Layout — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<DashboardLayoutV2 />"
      />
      <DSComponentSpec
        description="Orquestador raíz del dashboard v2. Define el grid de 12 columnas, los splits 8/4 y 7/5, el orden visual y el manejo de estados (loaded / empty / error). Es lo único que /dashboard03 importa."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
                href="/dashboard03"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
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
                <div className="max-w-2xl">
                  <MiniLayout />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Mapa visual del grid 12-col. Las celdas oscuras marcan los bloques hero (KPI saldo + Chart).
                  </p>
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
