import { LayoutGrid, ListFilter, Music, Sparkles, ChevronRight } from "lucide-react";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { getDSLastUpdated } from "@/config/designSystem";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSTokens,
  DSA11y,
  DSUsage,
  DSCode,
} from "../../components/spec";

const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "CatalogHeader", desc: "Search + sort + page-size + view-mode toggle + meta de resultados." },
  { name: "FilterPanel (sidebar 280px)", desc: "Sticky en desktop. En mobile se renderiza como FilterPanelMobileSheet." },
  { name: "ThemedCards", desc: "4 presets temáticos al inicio. Solo visible cuando NO hay filtros activos y feature flag ON." },
  { name: "TrackList", desc: "Switcher grid ↔ table según viewMode del store. Aria-busy durante refetch." },
  { name: "CatalogPagination", desc: "Prev/next + números + ellipsis. Soporta arrows del teclado fuera de inputs." },
  { name: "Empty/Error states", desc: "5 ramas: empty, no-results-search, filtered-empty, error, success." },
];

const TOKENS = [
  "rounded-card",
  "bg-surface / bg-page-bg",
  "gap-6 (vertical rhythm)",
  "lg:grid-cols-[280px_1fr]",
  "sticky top-4 (filter sidebar)",
  "smooth-scroll on page change",
];

const A11Y = [
  "Skip link al inicio: <a href=\"#catalog-results\"> Saltar a resultados.",
  "<main id=\"catalog-results\"> con aria-label en cada sección.",
  "Search expone role=\"search\" + aria-label.",
  "Atajo `/` enfoca el search desde cualquier scroll position.",
  "Pagination: aria-label en links + aria-current=\"page\" en activo.",
];

const DOS = [
  "Mantener URL como single source of truth para filters/sort/page (useCatalogUrlState).",
  "Resetear page → 1 cuando cambian filters/search/sort.",
  "Mostrar ThemedCards solo cuando hasActiveFilters === false (evita ruido).",
  "Scroll-to-top suave en cambio de página.",
];

const DONTS = [
  "Mover el state de filtros al store global — debe vivir en URL para shareability.",
  "Renderizar TrackList cuando isError es true — usar CatalogErrorState con onRetry.",
  "Olvidar el feature flag FEATURE_THEMED_CARDS — el bloque themed es opcional.",
  "Anidar CatalogPage dentro de un scroll container — la paginación scroll-into-view depende del documento.",
];

const STATE_TABLE: Array<{ when: string; render: string }> = [
  { when: "isError", render: "<CatalogErrorState onRetry={refetch} />" },
  { when: "isLoading && !data", render: "<TrackListSkeleton variant={viewMode} count={12} />" },
  { when: "tracks.length === 0 && search.trim()", render: "<NoResultsEmptyState query=\"…\" suggestions=… />" },
  { when: "tracks.length === 0 && hasActiveFilters", render: "<FilteredEmptyState onClearFilters=… />" },
  { when: "tracks.length === 0", render: "<CatalogEmptyState />" },
  { when: "default", render: "<TrackList /> + <CatalogPagination />" },
];

const SNIPPET = `import { CatalogPage } from "@/modules/tracks/components/CatalogPage";

// Page route (src/pages/Catalog.tsx) — thin wrapper.
export default function CatalogRoute() {
  return (
    <OnboardingGuard>
      <CatalogPage />
    </OnboardingGuard>
  );
}

// CatalogPage internamente:
const { filters, page, pageSize, setFilters, setPage, resetFilters, hasActiveFilters }
  = useCatalogUrlState();
const { data, isLoading, isFetching, isError, refetch }
  = useCatalogSearch({ filters, page, pageSize });

// Render: header → grid [sidebar 280px | results column]`;

export function CatalogPageSection() {
  return (
    <>
      <DSSectionHeader
        id="catalog-page"
        title={`Catalog Page — ${VERSION}`}
        status="stable"
        lastUpdate={getDSLastUpdated("catalog-page")}
        componentName="<CatalogPage />"
      />
      <DSComponentSpec
        description="Pattern de página completa del catálogo. Orquesta header + filter panel + themed shelf + track list + paginación, con URL como single source of truth para filters/sort/page. No es un componente atómico: es la composición canónica que cualquier vista de exploración debería seguir."
      >
        <a
          href="/catalog"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-foreground hover:underline"
        >
          Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog</code>
        </a>

        <DSAnatomy parts={ANATOMY} />

        <DSVariants>
          <CatalogPageWireframe />
          <p className="mt-3 text-xs text-muted-foreground">
            Wireframe del layout en desktop. El sidebar de 280px colapsa en mobile y se
            abre como bottom-sheet desde el botón "Filtros" del header.
          </p>
        </DSVariants>

        <section className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tabla de orquestación de estados
          </h3>
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Cuando</th>
                  <th className="px-3 py-2 text-left font-semibold">Renderiza</th>
                </tr>
              </thead>
              <tbody>
                {STATE_TABLE.map((row) => (
                  <tr key={row.when} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs text-foreground">{row.when}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.render}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <DSTokens tokens={TOKENS} />
        <DSA11y items={A11Y} />
        <DSUsage dos={DOS} donts={DONTS} />
        <DSCode snippet={SNIPPET} />
      </DSComponentSpec>
    </>
  );
}

function CatalogPageWireframe() {
  return (
    <div className="rounded-card border border-dashed border-border bg-page-bg/60 p-4">
      {/* Header */}
      <div className="mb-3 rounded-md border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">CatalogHeader</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <ListFilter className="h-3 w-3" /> Filtros · Sort · 25 · grid/list
          </div>
        </div>
        <div className="h-7 rounded bg-muted/60" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[160px_1fr]">
        {/* Sidebar */}
        <div className="rounded-md border border-border bg-card p-3">
          <span className="text-xs font-semibold text-foreground">FilterPanel</span>
          <ul className="mt-2 space-y-1 text-[10px] text-muted-foreground">
            <li>Género</li>
            <li>Mood</li>
            <li>Duración</li>
            <li>Plataforma</li>
            <li>Favoritos</li>
          </ul>
        </div>

        {/* Results column */}
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="h-3 w-3" /> ThemedCards (opcional)
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-muted/60" />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <LayoutGrid className="h-3 w-3" /> TrackList (grid/table)
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded bg-muted/60" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center rounded-md border border-border bg-card p-2 text-[10px] text-muted-foreground">
            <Music className="mr-1 h-3 w-3" /> CatalogPagination · ‹ 1 2 … 50 ›
            <ChevronRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
