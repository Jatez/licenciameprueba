import { RefreshCw } from "lucide-react";
import {
  DSSectionHeader,
} from "../../components/DSSectionHeader";
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
  { name: "StickyWrapper", desc: "Contenedor sticky -top-12 con gradiente translúcido + backdrop-blur." },
  { name: "HeaderRow", desc: "Flex horizontal lg:items-center que separa el cluster de título de las acciones." },
  { name: "TitleCluster", desc: "<h1>Dashboard</h1> + <FreshnessIndicator /> en una sola línea." },
  { name: "ActionsCluster", desc: "<PeriodSelector /> + botón Refresh + <ExportMenu />." },
  { name: "HeadroomTransform", desc: "Capa transform: translateY controlada por scroll (hook useHeadroom)." },
];

const TOKENS = [
  "bg-canvas (#F3F4F6)",
  "backdrop-blur-[12px]",
  "z-20",
  "sticky / -top-12",
  "px-10 / pt-12 / pb-6",
  "my-[20px]",
  "text-3xl / lg:text-4xl",
  "font-semibold / tracking-tight",
  "duration-300 / ease-in-out",
  "will-change-transform",
];

const A11Y = [
  "Root semántico <header>; el bloque sticky es un wrapper <div> presentacional.",
  "Botón Refresh con aria-label desde strings.ts; ícono RefreshCw con aria-hidden.",
  "Touch target mínimo 44×44px en mobile (min-h-[44px] sm:min-h-0).",
  "Spinner de refresh con animate-spin; respetar prefers-reduced-motion en futuras iteraciones.",
  "Z-index 20 dentro del contexto del BodyCard — no compite con sidebar (50) ni drawer (60).",
];

const DOS = [
  "Usar siempre dentro de <DashboardLayoutV2 /> (el wrapper compensa el padding del BodyCard con -mx-10 -mt-12).",
  "Pasar freshness cuando exista; en error state omitirlo (variante sin pill).",
  "Mantener el período + acciones a la derecha en una sola fila para preservar la altura mínima.",
  "Reusar el hook useHeadroom para otros headers sticky en lugar de duplicar la lógica de scroll.",
];

const DONTS = [
  "Envolver el wrapper en otro contenedor con overflow: hidden — rompe el sticky.",
  "Usar display: none para ocultarlo en scroll; siempre transform translateY(-100%).",
  "Hardcodear hex del fondo: usar la variable rgba(243,244,246,…) que matchea bg-canvas.",
  "Quitar el backdrop-blur sin reemplazarlo por un fondo opaco (las cards se verían encima del título).",
];

const SNIPPET = `import { useHeadroom } from "@/shared/hooks";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardLayoutV2() {
  const { isVisible } = useHeadroom();

  return (
    <div className="flex flex-col gap-6">
      <div
        className="sticky -top-12 z-20 -mx-10 -mt-12 px-10 pt-12 pb-6 my-[20px]
                   transition-transform duration-300 ease-in-out will-change-transform"
        style={{
          background:
            "linear-gradient(180deg, rgba(243,244,246,1) 0%, rgba(243,244,246,0.6) 50%, rgba(243,244,246,0) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <DashboardHeader {...headerProps} />
      </div>
      {/* ...resto del dashboard */}
    </div>
  );
}`;

/* -------------------- Mini-mocks visuales -------------------- */

function HeaderMock({ hidden = false, freshness = true }: { hidden?: boolean; freshness?: boolean }) {
  return (
    <div className="relative w-full h-[80px] overflow-hidden rounded-md border border-border bg-muted">
      <div
        className="absolute inset-x-0 top-0 px-3 pt-3 pb-2 transition-transform duration-300"
        style={{
          background:
            "linear-gradient(180deg, rgba(243,244,246,1) 0%, rgba(243,244,246,0.6) 60%, rgba(243,244,246,0) 100%)",
          backdropFilter: "blur(8px)",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Dashboard</span>
            {freshness && (
              <span className="inline-flex h-2 w-2 rounded-full bg-success" aria-hidden="true" />
            )}
          </div>
          <div className="flex gap-1">
            <span className="h-4 w-12 rounded bg-card border border-border" />
            <span className="h-4 w-4 rounded bg-card border border-border" />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-2 space-y-1">
        <div className="h-2 w-3/4 rounded bg-card" />
        <div className="h-2 w-1/2 rounded bg-card" />
      </div>
    </div>
  );
}

function RefreshingMock() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
      <RefreshCw className="h-4 w-4 animate-spin text-foreground" aria-hidden="true" />
      <span className="text-xs text-foreground">Actualizar</span>
    </div>
  );
}

function FreshnessMock({ tone, label }: { tone: "success" | "warning" | "error"; label: string }) {
  const dot =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-error";
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-2 py-1">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      <span className="text-[10px] text-foreground font-medium">{label}</span>
    </div>
  );
}

const STATES = [
  { label: "at-top", className: "translateY(0)", node: <HeaderMock /> },
  { label: "scrolling-down", className: "translateY(-100%)", node: <HeaderMock hidden /> },
  { label: "scrolling-up", className: "translateY(0)", node: <HeaderMock /> },
  { label: "refreshing", className: "animate-spin", node: <RefreshingMock /> },
  { label: "fresh", className: "bg-success", node: <FreshnessMock tone="success" label="Hace 2 min" /> },
  { label: "stale", className: "bg-warning", node: <FreshnessMock tone="warning" label="Hace 30 min" /> },
  { label: "very-stale", className: "bg-error", node: <FreshnessMock tone="error" label="Hace 2 h" /> },
];

export function DashboardHeaderSection() {
  return (
    <>
      <DSSectionHeader
        id="dashboard-header"
        title={`Dashboard Header (Sticky) — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<DashboardHeader />"
      />
      <DSComponentSpec description="Header sticky del dashboard v2 con efecto frosted glass y comportamiento Headroom (scroll-aware): se oculta al hacer scroll hacia abajo y reaparece al instante al scrollear hacia arriba. Combina <DashboardHeader /> + el wrapper sticky de <DashboardLayoutV2 /> + el hook useHeadroom." layout="split">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground mb-2">default</p>
              <HeaderMock />
              <p className="text-xs text-muted-foreground mt-2">
                Con freshness, período y acciones. Uso normal en /dashboard03.
              </p>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground mb-2">error / sin freshness</p>
              <HeaderMock freshness={false} />
              <p className="text-xs text-muted-foreground mt-2">
                Variante usada en error state — se omite la prop <code>freshness</code>.
              </p>
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
