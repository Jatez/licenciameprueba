import { useState } from "react";
import type { CatalogFilters, CatalogPageSize, CatalogSortOption } from "@/api/types";
import type { CatalogViewMode } from "@/stores/catalogStore";
import { CatalogHeader } from "@/modules/tracks/components/CatalogHeader";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSCollapsibleTokens,
  DSCollapsibleA11y,
  DSUsage,
  DSCode,
} from "../../components/spec";
import { getDSLastUpdated } from "@/config/designSystem";
import { DSCatalogDemoWrapper } from "./_shared/DSCatalogDemoWrapper";

const VERSION = "v1.1.0";

const DEFAULT_FILTERS: CatalogFilters = {
  search: "",
  genres: [],
  moods: [],
  durationRange: null,
  platforms: [],
  onlyFavorites: false,
  sort: "popularity-desc",
};

const ANATOMY = [
  { name: "Title + subtitle", desc: "Encabezado de la página (h1 + p)." },
  { name: "SearchInput", desc: "Input debounced (300ms) con clear button. Atajo `/`." },
  { name: "Filtros (mobile)", desc: "Botón Filtros visible <lg que abre el bottom-sheet." },
  { name: "SortDropdown", desc: "7 opciones (popularidad, recientes, A-Z, duración, artista)." },
  { name: "PageSizeSelector", desc: "25 / 50 / 100 items por página." },
  { name: "ViewModeToggle", desc: "Grid ↔ list. Persiste en catalogStore (no en URL)." },
  { name: "ActiveFiltersChips", desc: "Chips removibles de los filtros activos (search, género, mood, etc.)." },
];

const TOKENS = [
  "text-xl sm:text-2xl (h1)",
  "text-sm text-muted-foreground (subtitle)",
  "gap-3 (vertical)",
  "gap-2 (controls)",
  "rounded-full (ViewModeToggle container)",
  "bg-primary text-ink-900 (toggle active)",
];

const A11Y = [
  "<form role=\"search\"> envuelve el input + clear button.",
  "Search soporta Enter (submit), Escape (clear), `/` global focus.",
  "ViewModeToggle usa aria-pressed + role=\"group\" con aria-label.",
  "Sort y PageSize exponen aria-label en el trigger.",
];

const DOS = [
  "Mantener el botón Filtros visible solo <lg — desktop usa el sidebar fijo.",
  "Debounce de 300ms en search para no spamear el endpoint.",
  "Resetear page → 1 en cada cambio de search/sort/filter (responsabilidad del hook URL).",
];

const DONTS = [
  "Renderizar SortDropdown vacío — siempre tiene 7 opciones fijas.",
  "Persistir viewMode en URL — es preferencia del usuario, va en store.",
  "Usar el botón Filtros en desktop — duplica el sidebar.",
  "Esconder los chips activos — son la única forma de saber qué filtros están aplicados sin abrir el panel.",
];

const SNIPPET = `import { CatalogHeader } from "@/modules/tracks/components/CatalogHeader";

<CatalogHeader
  filters={filters}
  pageSize={pageSize}
  viewMode={viewMode}
  onSearchChange={(search) => setFilters({ search })}
  onSortChange={(sort) => setFilters({ sort })}
  onPageSizeChange={setPageSize}
  onViewModeChange={setViewMode}
  onPatchFilters={setFilters}
  onClearFilters={resetFilters}
  onOpenMobileFilters={() => setFiltersOpen(true)}
/>`;

export function CatalogHeaderSection() {
  return (
    <>
      <DSSectionHeader
        id="catalog-header"
        title={`Catalog Header — ${VERSION}`}
        status="stable"
        lastUpdate={getDSLastUpdated("catalog-header")}
        componentName="<CatalogHeader />"
      />
      <DSComponentSpec
        description="Header del catálogo: búsqueda + sort + page-size + view-mode + chips de filtros activos. Composición que vive arriba de la grilla [sidebar | resultados]. Todos los inputs son controlados desde useCatalogUrlState."
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
                <div className="space-y-6">
                  <Variant label="Default · sin filtros activos">
                    <CatalogHeaderDemo initialFilters={DEFAULT_FILTERS} />
                  </Variant>
                  <Variant label="Con filtros activos · chips visibles">
                    <CatalogHeaderDemo
                      initialFilters={{
                        ...DEFAULT_FILTERS,
                        search: "reggaeton",
                        genres: ["latin"],
                        onlyFavorites: true,
                      }}
                    />
                  </Variant>
                </div>
              </DSVariants>
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

interface CatalogHeaderDemoProps {
  initialFilters: CatalogFilters;
}

function CatalogHeaderDemo({ initialFilters }: CatalogHeaderDemoProps) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [pageSize, setPageSize] = useState<CatalogPageSize>(25);
  const [viewMode, setViewMode] = useState<CatalogViewMode>("grid");

  const patch = (p: Partial<CatalogFilters>) => setFilters((prev) => ({ ...prev, ...p }));

  return (
    <DSCatalogDemoWrapper>
      <CatalogHeader
        filters={filters}
        pageSize={pageSize}
        viewMode={viewMode}
        onSearchChange={(search) => patch({ search })}
        onSortChange={(sort: CatalogSortOption) => patch({ sort })}
        onPageSizeChange={setPageSize}
        onViewModeChange={setViewMode}
        onPatchFilters={patch}
        onClearFilters={() => setFilters(initialFilters)}
        onOpenMobileFilters={() => undefined}
      />
    </DSCatalogDemoWrapper>
  );
}
