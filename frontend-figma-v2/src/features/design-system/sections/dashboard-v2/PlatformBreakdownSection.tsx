import { Instagram, Music2, Youtube } from "lucide-react";
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
  { name: "Card", desc: "Card light estándar (bg-card)." },
  { name: "Header", desc: "Título + subtítulo 'Cuentas conectadas y sus métricas'." },
  { name: "PlatformCard", desc: "Card por plataforma con badge negro/blanco + nombre + métricas en columnas." },
  { name: "PlatformIcon", desc: "Logo de app sobre fondo negro / icono blanco (regla DS — todos los logos así)." },
  { name: "MetricColumn", desc: "Columna interna con label uppercase + valor font-tnum." },
];

const TOKENS = [
  "bg-card",
  "rounded-card / p-6",
  "gap-3 (between platforms)",
  "bg-foreground (icon background — regla del DS para logos de apps)",
  "text-background (icon color)",
  "text-base font-semibold (title)",
  "text-xs text-muted-foreground",
];

const A11Y = [
  "Cada PlatformCard tiene aria-label combinando platform + métricas clave.",
  "Logos decorativos con aria-hidden — el nombre de plataforma va en texto.",
  "Métricas con font-tnum para alineación entre filas.",
  "Estado 'no conectada' incluye CTA accesible para conectar.",
];

const DOS = [
  "Mantener todas las plataformas en el mismo orden entre sesiones (sort estable).",
  "Usar el patrón fondo-negro/icono-blanco para TODOS los logos de apps (regla del DS).",
  "Mostrar 'sin datos' por métrica cuando no hay suficiente histórico (no ocultarla).",
  "Reservar este split a la derecha del TopTracks (lg:col-span-5).",
];

const DONTS = [
  "Usar los colores de marca de cada plataforma (Instagram gradient, etc) — rompe la regla del DS.",
  "Mezclar plataformas conectadas y desconectadas sin diferenciarlas visualmente.",
  "Mostrar más de 5 plataformas — el chart pierde escaneabilidad.",
  "Cargar el chart como bar list — el patrón actual es card list.",
];

const SNIPPET = `import { PlatformBreakdown } from "@/modules/packages/dashboards/dashboard-v2/components/PlatformBreakdown";

<PlatformBreakdown
  platforms={data.platformMetrics}
  isLoading={isLoading}
/>

// PlatformMetrics:
// {
//   platform: "instagram" | "tiktok" | "youtube" | ...,
//   accountsConnected: 1,
//   licensedPosts: 8,
//   impressions: 12_400,
//   detectedPosts: 14,
// }`;

function MiniPlatformRow({
  Icon,
  name,
  posts,
  impressions,
}: {
  Icon: typeof Instagram;
  name: string;
  posts: number;
  impressions: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card p-2">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground"
        aria-hidden="true"
      >
        <Icon className="h-4 w-4 text-background" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-foreground">{name}</p>
        <p className="text-[9px] text-muted-foreground">@marca.demo</p>
      </div>
      <div className="flex gap-3 text-right">
        <div>
          <p className="text-[8px] uppercase text-muted-foreground">Posts</p>
          <p className="text-[10px] font-tnum font-semibold text-foreground">{posts}</p>
        </div>
        <div>
          <p className="text-[8px] uppercase text-muted-foreground">Imp.</p>
          <p className="text-[10px] font-tnum font-semibold text-foreground">{impressions}</p>
        </div>
      </div>
    </div>
  );
}

function MiniBreakdown() {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3">
      <p className="text-[10px] font-semibold text-foreground">Métricas por plataforma</p>
      <MiniPlatformRow Icon={Instagram} name="Instagram" posts={8} impressions="12.4K" />
      <MiniPlatformRow Icon={Music2} name="TikTok" posts={6} impressions="34.1K" />
      <MiniPlatformRow Icon={Youtube} name="YouTube" posts={2} impressions="8.2K" />
    </div>
  );
}

const STATES = [
  { label: "with-data", node: <MiniBreakdown /> },
  {
    label: "loading",
    node: (
      <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-7 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    ),
  },
  {
    label: "single-platform",
    node: <MiniPlatformRow Icon={Instagram} name="Instagram" posts={8} impressions="12.4K" />,
  },
  {
    label: "no-impressions",
    node: <MiniPlatformRow Icon={Youtube} name="YouTube" posts={0} impressions="—" />,
  },
];

export function PlatformBreakdownSection() {
  return (
    <>
      <DSSectionHeader
        id="platform-breakdown"
        title={`Platform Breakdown — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<PlatformBreakdown /> · <PlatformCard />"
      />
      <DSComponentSpec description="Card que desglosa métricas por plataforma social conectada. Usa el patrón unificado de logos sobre fondo negro / icono blanco (regla del DS para todos los logos de apps del producto)." layout="split">
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
            <MiniBreakdown />
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
