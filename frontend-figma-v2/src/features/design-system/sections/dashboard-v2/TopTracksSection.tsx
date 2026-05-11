import { Music } from "lucide-react";
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
  { name: "Card", desc: "Card light estándar sobre bg-card / text-card-foreground." },
  { name: "Header", desc: "Título + subtítulo + Select con criterio de orden (licenses/impressions/credits)." },
  { name: "TopTrackRow", desc: "Fila con número de posición, cover 12x12, título + artista, métrica destacada." },
  { name: "Separator", desc: "Línea sutil entre rows (Separator del DS, my-0.5 bg-border)." },
  { name: "ViewAllLink", desc: "Link button que navega al catálogo completo." },
];

const TOKENS = [
  "bg-card",
  "text-card-foreground",
  "rounded-card / p-6",
  "h-12 w-12 rounded-md (cover)",
  "text-base font-semibold (title)",
  "text-xs text-muted-foreground",
  "h-8 w-[180px] (sort select)",
];

const A11Y = [
  "<ol> con aria-label='Top tracks' para anunciar lista ordenada.",
  "Select de orden con aria-label desde strings.sortLabel.",
  "Cover con alt='' (decorativo) cuando el título acompaña en texto adyacente.",
  "Cada row es un Link a la página de detalle del track — touch target ≥44×44.",
  "Posición numerada visible (no solo orden visual).",
];

const DOS = [
  "Limitar a 5 tracks visibles — más se vuelve scroll dentro de scroll.",
  "Reorganizar al cambiar el sort sin cambiar el título de la sección.",
  "Usar useTopTracksSort para encapsular la lógica de ordenamiento.",
  "Empty state debe ofrecer CTA al catálogo.",
];

const DONTS = [
  "Mostrar más de 5 rows en la card — usar la página completa.",
  "Mezclar criterios de sort en la misma vista (un Select por card).",
  "Cargar audio del player desde aquí — solo navega al detalle.",
  "Mostrar score/algoritmo del ranking — confunde al usuario final.",
];

const SNIPPET = `import { TopTracks } from "@/modules/packages/dashboards/dashboard-v2/components/TopTracks";

<TopTracks
  tracks={data.topTracks}
  isLoading={isLoading}
/>

// data.topTracks: TopTrack[] (max 5)
// type TopSongSort = "licenses" | "impressions" | "credits"`;

function MiniRow({ pos, title, artist, metric }: { pos: number; title: string; artist: string; metric: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border py-1.5 last:border-b-0">
      <span className="w-3 text-[10px] font-tnum text-muted-foreground">{pos}</span>
      <span className="h-6 w-6 shrink-0 rounded-sm bg-muted" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold text-foreground">{title}</p>
        <p className="truncate text-[9px] text-muted-foreground">{artist}</p>
      </div>
      <span className="text-[10px] font-tnum font-semibold text-foreground">{metric}</span>
    </div>
  );
}

function MiniTopTracks() {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold text-foreground">Top tracks</p>
        <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[9px] text-muted-foreground">
          Por licencias ▾
        </span>
      </div>
      <MiniRow pos={1} title="Verano en la ciudad" artist="Milkjive" metric="12" />
      <MiniRow pos={2} title="Latido eléctrico" artist="Cat Eyes" metric="8" />
      <MiniRow pos={3} title="Costa norte" artist="Vitamin C" metric="5" />
    </div>
  );
}

const STATES = [
  { label: "with-data", node: <MiniTopTracks /> },
  {
    label: "loading",
    node: (
      <div className="flex w-full flex-col gap-1.5 rounded-md border border-border bg-card p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-muted" />
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
    label: "empty",
    node: (
      <div className="flex w-full flex-col items-center justify-center gap-1 rounded-md border border-border bg-card p-3 text-muted-foreground">
        <Music className="h-4 w-4" aria-hidden="true" />
        <span className="text-[10px]">Sin tracks aún</span>
      </div>
    ),
  },
  {
    label: "sort=impressions",
    node: <MiniRow pos={1} title="Verano en la ciudad" artist="Milkjive" metric="12.4K" />,
  },
  {
    label: "sort=credits",
    node: <MiniRow pos={1} title="Verano en la ciudad" artist="Milkjive" metric="384c" />,
  },
];

export function TopTracksSection() {
  return (
    <>
      <DSSectionHeader
        id="top-tracks"
        title={`Top Tracks — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<TopTracks /> · <TopTrackRow />"
      />
      <DSComponentSpec description="Lista ordenable de los 5 tracks más relevantes del período. Ordenamiento por licencias emitidas, impresiones o créditos consumidos. Empty state con CTA al catálogo." layout="split">
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
            <MiniTopTracks />
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
