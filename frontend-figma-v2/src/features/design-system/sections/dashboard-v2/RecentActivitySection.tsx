import { CreditCard, FileCheck, Inbox, Radar } from "lucide-react";
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
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "Card", desc: "Contenedor light, full width al final del dashboard." },
  { name: "Header", desc: "Título + Tabs (Todas/Licencias/Pagos/Publicaciones) con badge de conteo por tab." },
  { name: "MomentHeader", desc: "Agrupa items por momento ('hace unos segundos', 'ayer', 'hace 3 días') + acción primaria del grupo." },
  { name: "ActivityItem", desc: "Row con icono semántico + título + meta (puede ocultar timestamp y CTA al estar agrupada)." },
  { name: "EmptyStateCard", desc: "Empty state contextual según el filtro activo (icono distinto por tab)." },
  { name: "ViewAllLink", desc: "Link al feed completo /activity con query param del filtro." },
];

const TOKENS = [
  "bg-card",
  "rounded-card / p-6",
  "gap-4 (header→content)",
  "gap-3 (between moment groups)",
  "TabsList del DS (border-b)",
  "bg-secondary text-secondary-foreground (count badge)",
  "h-9 w-9 rounded-full (icon avatar)",
];

const A11Y = [
  "Tabs nativas del DS (Radix) — navegación por flechas izquierda/derecha.",
  "Cada Tab muestra el conteo en un Badge — no solo color o ícono.",
  "MomentHeader es <header> dentro de <section> — jerarquía clara para AT.",
  "Lista de items es <ul> con <li> por actividad.",
  "Empty state por tab tiene título y descripción específicos (no genéricos).",
];

const DOS = [
  "Mantener máximo 5 items visibles por tab en el dashboard — usar /activity para feed completo.",
  "Agrupar por momento (groupActivityByMoment) en lugar de mostrar cada timestamp.",
  "Hide timestamp + CTA en items dentro de un grupo (la cabecera del grupo lleva la info).",
  "Resetear el filtro al cambiar de período del dashboard.",
];

const DONTS = [
  "Mostrar más de 5 items por tab — fatiga visual.",
  "Mezclar acciones destructivas en este feed — solo eventos pasivos + 'ver detalle'.",
  "Auto-actualizar el feed mientras el usuario lee — usar el botón Actualizar del header.",
  "Eliminar el badge de conteo de las tabs — el usuario necesita anticipar volumen.",
];

const SNIPPET = `import { RecentActivity } from "@/modules/packages/dashboards/dashboard-v2/components/RecentActivity";

<RecentActivity
  items={data.recentActivity}
  isLoading={isLoading}
/>

// Tabs disponibles (ActivityGroupKey):
// "all" | "licenses" | "payments" | "publications"`;

function MiniTab({ label, count, active = false }: { label: string; count: number; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 border-b-2 px-2 pb-1 text-[10px] font-medium ${
        active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
      }`}
    >
      {label}
      <span className="rounded bg-secondary px-1 text-[9px] font-tnum text-secondary-foreground">{count}</span>
    </span>
  );
}

function MiniActivityRow({ Icon, title, meta }: { Icon: typeof Inbox; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-2.5 w-2.5 text-foreground" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium text-foreground">{title}</p>
        <p className="truncate text-[9px] text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function MiniRecentActivity() {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold text-foreground">Actividad reciente</p>
        <div className="flex items-center gap-1">
          <MiniTab label="Todas" count={15} active />
          <MiniTab label="Lic." count={6} />
          <MiniTab label="Pagos" count={2} />
        </div>
      </div>
      <p className="mb-1 text-[9px] font-medium uppercase text-muted-foreground">Hace unos segundos</p>
      <MiniActivityRow Icon={FileCheck} title="Licencia emitida" meta="Para 'Verano en la ciudad'" />
      <MiniActivityRow Icon={Radar} title="LIC-A8F3 activada" meta="Auto-match con 'Cat Eyes'" />
      <p className="mb-1 mt-2 text-[9px] font-medium uppercase text-muted-foreground">Ayer</p>
      <MiniActivityRow Icon={CreditCard} title="Compra confirmada" meta="Bolsa de 300 créditos" />
    </div>
  );
}

const STATES = [
  { label: "with-items", node: <MiniRecentActivity /> },
  {
    label: "loading",
    node: (
      <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-1.5 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "empty-filter",
    node: (
      <div className="flex w-full flex-col items-center justify-center gap-1 rounded-md border border-border bg-card p-3 text-muted-foreground">
        <CreditCard className="h-4 w-4" aria-hidden="true" />
        <span className="text-[10px]">Sin pagos en el período</span>
      </div>
    ),
  },
  {
    label: "tab=licenses",
    node: <MiniTab label="Licencias" count={6} active />,
  },
  {
    label: "single-moment",
    node: (
      <div className="rounded-md border border-border bg-card p-2">
        <p className="text-[9px] font-medium uppercase text-muted-foreground">Hace unos segundos</p>
        <MiniActivityRow Icon={FileCheck} title="Licencia emitida" meta="Para 'Verano en la ciudad'" />
      </div>
    ),
  },
];

export function RecentActivitySection() {
  return (
    <>
      <DSSectionHeader
        id="recent-activity"
        title={`Recent Activity — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<RecentActivity /> · <ActivityItem /> · <MomentHeader />"
      />
      <DSComponentSpec description="Feed agrupado por momentos (segundos/horas/días) con tabs de filtro por tipo. Se renderiza al final del dashboard como cierre del scroll. Cada tab incluye conteo y empty state propio." layout="split">
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
          <div className="max-w-md">
            <MiniRecentActivity />
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
