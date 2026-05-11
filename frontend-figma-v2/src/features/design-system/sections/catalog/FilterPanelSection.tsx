import { useState } from "react";
import type { CatalogFilters } from "@/api/types";
import { FilterPanel } from "@/modules/tracks/components/FilterPanel";
import { Button } from "@/components/ui/button";
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
import { MOCK_FILTER_DATA } from "./_shared/mocks";

const TODAY = "2026-04-24";
const VERSION = "v1.0.0";

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
  { name: "Header", desc: "Título 'Filtros' + botón 'Limpiar filtros' (solo si hasActiveFilters)." },
  { name: "FilterSectionGenre", desc: "Lista de géneros con contadores. Soporta ver más / ver menos." },
  { name: "FilterSectionMood", desc: "Chips de moods disponibles para los tracks actuales." },
  { name: "FilterSectionDuration", desc: "Slider min/max en segundos." },
  { name: "FilterSectionPlatform", desc: "Toggle por cada LicensablePlatform (instagram/tiktok/facebook)." },
  { name: "FilterSectionFavorites", desc: "Switch 'Solo mis favoritos'. Oculto si FEATURE_FAVORITES off." },
  { name: "Mobile sheet", desc: "FilterPanelMobileSheet envuelve el mismo FilterPanel en un Sheet (left)." },
];

const TOKENS = [
  "rounded-card",
  "border border-border",
  "bg-surface",
  "p-4",
  "sticky top-4 (desktop sidebar)",
  "w-full max-w-sm sm:max-w-md (mobile sheet)",
];

const A11Y = [
  "<aside aria-label=\"Filtros\"> envuelve todo el panel.",
  "Cada sección con <h3> + región semántica para navegación por landmarks.",
  "Sliders Radix exponen aria-valuenow/min/max y soportan flechas del teclado.",
  "Sheet trap focus y permite cerrar con Esc + click fuera.",
  "Botón limpiar visible solo cuando hasActiveFilters → discoverable + reversible.",
];

const DOS = [
  "Renderizar el panel desktop dentro de <div className=\"sticky top-4\"> dentro de la columna de 280px.",
  "Pasar data?.availableGenres y availableMoods al FilterPanel — los counts vienen del API.",
  "Skeleton de 5 filas cuando isLoading && !data.",
  "Reusar el mismo <FilterPanel /> dentro del Sheet en mobile (no duplicar markup).",
];

const DONTS = [
  "Hardcodear géneros — vienen del API en availableGenres con sus counts.",
  "Mostrar el botón Limpiar siempre — solo cuando hasActiveFilters === true.",
  "Sticky top: 0 — usar top-4 para respirar respecto al chrome del sidebar.",
  "Renderizar 2 instancias del FilterPanel desktop + sheet en mobile — colocar el sheet como hermano y dejar que CSS oculte el desktop sidebar con `lg:block`.",
];

const SNIPPET = `import { FilterPanel, FilterPanelMobileSheet } from "@/modules/tracks/components/FilterPanel";

// Desktop
<div className="hidden lg:block">
  <div className="sticky top-4">
    <FilterPanel
      filters={filters}
      data={data}
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onPatch={setFilters}
      onClearAll={resetFilters}
    />
  </div>
</div>

// Mobile (mismo componente dentro de Sheet)
<FilterPanelMobileSheet
  open={isFiltersOpen}
  onOpenChange={setFiltersOpen}
  filters={filters}
  data={data}
  isLoading={isLoading}
  hasActiveFilters={hasActiveFilters}
  onPatch={setFilters}
  onClearAll={resetFilters}
/>`;

export function FilterPanelSection() {
  return (
    <>
      <DSSectionHeader
        id="filter-panel"
        title={`Filter Panel — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<FilterPanel /> · <FilterPanelMobileSheet /> · <ActiveFiltersChips />"
      />
      <DSComponentSpec
        description="Sidebar de filtros del catálogo: género, mood, duración, plataforma, favoritos. Mismo componente se reusa en desktop (sidebar sticky) y mobile (bottom-sheet)."
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
                  <Variant label="Sin filtros activos">
                    <FilterPanelDemo initialFilters={DEFAULT_FILTERS} />
                  </Variant>
                  <Variant label="Con filtros activos · botón Limpiar visible">
                    <FilterPanelDemo
                      initialFilters={{
                        ...DEFAULT_FILTERS,
                        genres: ["latin", "pop"],
                        platforms: ["instagram"],
                        onlyFavorites: true,
                      }}
                    />
                  </Variant>
                </div>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "loading skeleton",
                    node: (
                      <div className="w-full space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-7 w-full animate-pulse rounded bg-muted" />
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: "mobile sheet",
                    className: "FilterPanelMobileSheet",
                    node: (
                      <div className="flex w-full flex-col items-center gap-2 text-center">
                        <Button size="sm" variant="outline">Abrir filtros</Button>
                        <p className="text-[10px] text-muted-foreground">Sheet side=left, max-w-sm</p>
                      </div>
                    ),
                  },
                  {
                    label: "0 disponibles",
                    node: (
                      <p className="text-[11px] text-muted-foreground text-center">
                        Si availableGenres está vacío,<br />se renderizan 0 chips.
                      </p>
                    ),
                  },
                ]}
              />
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

function FilterPanelDemo({ initialFilters }: { initialFilters: CatalogFilters }) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const hasActive =
    filters.search.length > 0 ||
    filters.genres.length > 0 ||
    filters.moods.length > 0 ||
    filters.platforms.length > 0 ||
    filters.onlyFavorites ||
    filters.durationRange !== null;

  return (
    <DSCatalogDemoWrapper>
      <FilterPanel
        filters={filters}
        data={MOCK_FILTER_DATA}
        isLoading={false}
        hasActiveFilters={hasActive}
        onPatch={(p) => setFilters((prev) => ({ ...prev, ...p }))}
        onClearAll={() => setFilters(initialFilters)}
      />
    </DSCatalogDemoWrapper>
  );
}
