import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { TrackList } from "@/modules/tracks/components/TrackList/TrackList";
import { TrackListSkeleton } from "@/modules/tracks/components/TrackList/TrackListSkeleton";
import type { CatalogViewMode } from "@/stores/catalogStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { DSCatalogDemoWrapper } from "./_shared/DSCatalogDemoWrapper";
import { MOCK_TRACKS } from "./_shared/mocks";

const TODAY = "2026-04-24";
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "TrackList (switcher)", desc: "Decide grid o table según viewMode. Aria-busy + opacity-60 cuando isFetching && !isLoading." },
  { name: "TrackGrid", desc: "<ul> grid 2/3/4 columnas de TrackCard." },
  { name: "TrackTable", desc: "<ul> space-y-2 de TrackRow." },
  { name: "TrackListSkeleton", desc: "Skeleton dual: variant='grid' o variant='list'. count configurable (default 12)." },
];

const TOKENS = [
  "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 (grid)",
  "space-y-2 (list)",
  "transition-opacity",
  "opacity-60 (refetching)",
  "pointer-events-none (refetching)",
  "rounded-card (skeleton blocks)",
];

const A11Y = [
  "<ul> con <li> por track — semántica de lista para AT.",
  "aria-busy=true durante refetch, no durante load inicial (ese caso usa skeleton).",
  "Skeleton aria-hidden — no se anuncia.",
  "Cada TrackCard/TrackRow conserva su propio aria-labelledby.",
];

const DECISIONS = [
  { mode: "grid", when: "Default. Catálogo de exploración, similares, presets temáticos." },
  { mode: "list", when: "Listas largas que el usuario va a escanear (sort por duración, búsqueda profunda)." },
];

const DOS = [
  "Pasar isFetching solo cuando hay data previa — la primera carga muestra el skeleton.",
  "Mantener viewMode en el catalogStore (Zustand), no en URL.",
  "Renderizar el skeleton con la misma variant que el viewMode actual.",
  "Reusar TrackList tanto en /catalog como en futuros listings filtrados (favoritos, playlists).",
];

const DONTS = [
  "Mostrar TrackList vacío — ese caso lo manejan los empty-states del CatalogPage.",
  "Cambiar viewMode automáticamente por viewport — es preferencia del usuario.",
  "Hardcodear count=12 en el skeleton — usar el pageSize si lo tienes.",
  "Anidar TrackList dentro de otro <ul> — rompe la semántica.",
];

const SNIPPET = `import { TrackList, TrackListSkeleton } from "@/modules/tracks/components/TrackList";

{isLoading && !data ? (
  <TrackListSkeleton variant={viewMode} count={pageSize} />
) : (
  <TrackList
    tracks={tracks}
    viewMode={viewMode}
    isFetching={isFetching && !isLoading}
  />
)}`;

export function TrackListSection() {
  return (
    <>
      <DSSectionHeader
        id="track-list"
        title={`Track List — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<TrackList /> · <TrackGrid /> · <TrackTable /> · <TrackListSkeleton />"
      />
      <DSComponentSpec
        description="Wrapper que conmuta entre grid y tabla según viewMode. Maneja estado de fetching con opacity, skeleton durante carga inicial."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
                href="/catalog"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog</code>
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
                <TrackListInteractiveDemo />
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "skeleton grid",
                    node: (
                      <div className="w-full">
                        <TrackListSkeleton variant="grid" count={4} />
                      </div>
                    ),
                  },
                  {
                    label: "skeleton list",
                    node: (
                      <div className="w-full">
                        <TrackListSkeleton variant="list" count={3} />
                      </div>
                    ),
                  },
                  {
                    label: "refetching",
                    node: (
                      <div className="w-full opacity-60" aria-busy>
                        <DSCatalogDemoWrapper frame="none">
                          <ul className="space-y-2 pointer-events-none">
                            <li>
                              <div className="h-12 rounded-card border border-border bg-surface" />
                            </li>
                          </ul>
                        </DSCatalogDemoWrapper>
                      </div>
                    ),
                  },
                ]}
              />
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Cuándo usar cada modo
                </h3>
                <div className="overflow-x-auto rounded-card border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">viewMode</th>
                        <th className="px-3 py-2 text-left font-semibold">Úsalo cuando…</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DECISIONS.map((d) => (
                        <tr key={d.mode} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs text-foreground">{d.mode}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{d.when}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}

function TrackListInteractiveDemo() {
  const [viewMode, setViewMode] = useState<CatalogViewMode>("grid");
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={viewMode === "grid" ? "default" : "outline"}
          onClick={() => setViewMode("grid")}
          className={cn("gap-1.5")}
        >
          <LayoutGrid className="h-4 w-4" /> Grid
        </Button>
        <Button
          size="sm"
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
          className={cn("gap-1.5")}
        >
          <List className="h-4 w-4" /> List
        </Button>
      </div>
      <DSCatalogDemoWrapper>
        <TrackList tracks={MOCK_TRACKS} viewMode={viewMode} isFetching={false} />
      </DSCatalogDemoWrapper>
    </div>
  );
}
