import { CatalogEmptyState } from "@/modules/tracks/components/empty-states/CatalogEmptyState";
import { NoResultsEmptyState } from "@/modules/tracks/components/empty-states/NoResultsEmptyState";
import { FilteredEmptyState } from "@/modules/tracks/components/empty-states/FilteredEmptyState";
import { CatalogErrorState } from "@/modules/tracks/components/empty-states/CatalogErrorState";
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

const TODAY = "2026-04-24";
const VERSION = "v1.0.0";

const DECISIONS = [
  { when: "isError", render: "<CatalogErrorState onRetry={refetch} />", reason: "Falla de red/servidor. Acción: reintentar." },
  { when: "tracks=[] && search.trim()", render: "<NoResultsEmptyState query suggestions />", reason: "Búsqueda activa sin matches. Sugerencias del API + clear search." },
  { when: "tracks=[] && hasActiveFilters", render: "<FilteredEmptyState onClearFilters />", reason: "Filtros demasiado restrictivos. CTA limpiar filtros." },
  { when: "tracks=[] (catalog vacío)", render: "<CatalogEmptyState />", reason: "Catálogo realmente vacío (caso raro, e.g. tenant nuevo)." },
];

const ANATOMY = [
  { name: "Icon container", desc: "h-12 w-12 rounded-xl. CatalogEmpty usa EmptyState (más grande). Error usa bg-error/15." },
  { name: "Title h3", desc: "text-base font-semibold." },
  { name: "Description", desc: "text-sm text-muted-foreground, max-w-sm para no extenderse." },
  { name: "Suggestions (NoResults)", desc: "Lista de chips Button outline aplicables al input de búsqueda." },
  { name: "CTA", desc: "Acción primaria contextual (reintentar / limpiar / aplicar sugerencia)." },
];

const TOKENS = [
  "rounded-xl (icon container small)",
  "bg-metric-subtle/[0.63] text-metric (no-results, filtered)",
  "bg-error/15 text-error (error)",
  "px-6 py-12 (vertical breathing)",
  "max-w-sm (description)",
];

const A11Y = [
  "Cada estado renderiza un <h3> con el título — landmark navegable.",
  "ErrorState envuelve en role='alert' implícito vía título + foco semántico.",
  "Botones de sugerencias del NoResults son <Button> nativos — Tab nav.",
  "Iconos siempre aria-hidden — la información es textual.",
];

const DOS = [
  "Mantener el orden de evaluación del switch: error → search → filtered → empty.",
  "Pasar suggestions del response (data?.suggestedSearches) — el backend prioriza.",
  "Reusar bg-metric-subtle/0.63 para los 2 estados 'sin resultados' (consistencia).",
  "Limitar a 1 CTA primaria por estado — más opciones diluyen.",
];

const DONTS = [
  "Mostrar el spinner mientras hay error — son estados mutuamente excluyentes.",
  "Inventar copys distintos a los catalogStrings.states.* — i18n centralizado.",
  "Usar CatalogEmptyState cuando hay filtros activos — confunde al usuario.",
  "Renderizar NoResults sin onClearSearch — el escape es obligatorio.",
];

const SNIPPET = `import {
  CatalogEmptyState,
  NoResultsEmptyState,
  FilteredEmptyState,
  CatalogErrorState,
} from "@/modules/tracks/components/empty-states";

{isError ? (
  <CatalogErrorState onRetry={refetch} />
) : tracks.length === 0 ? (
  search.trim() ? (
    <NoResultsEmptyState
      query={search}
      suggestions={data?.suggestedSearches ?? null}
      onClearSearch={() => setFilters({ search: "" })}
      onApplySuggestion={(s) => setFilters({ search: s })}
    />
  ) : hasActiveFilters ? (
    <FilteredEmptyState onClearFilters={resetFilters} />
  ) : (
    <CatalogEmptyState />
  )
) : (
  <TrackList ... />
)}`;

export function CatalogEmptyStatesSection() {
  return (
    <>
      <DSSectionHeader
        id="catalog-empty-states"
        title={`Catalog Empty States — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<CatalogEmptyState /> · <NoResultsEmptyState /> · <FilteredEmptyState /> · <CatalogErrorState />"
      />
      <DSComponentSpec
        description="Los 4 estados vacíos del catálogo: catálogo realmente vacío, búsqueda sin matches, filtros sin matches, error de carga. Cada uno con icono, copy y CTA específicos."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
                href="/catalog?search=zzz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog?search=zzz</code>
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
                <div className="grid grid-cols-1 gap-4">
                  <Box label="CatalogEmptyState">
                    <CatalogEmptyState />
                  </Box>
                  <Box label="NoResultsEmptyState">
                    <NoResultsEmptyState
                      query="zzz"
                      suggestions={["reggaeton", "lo-fi", "épico"]}
                      onClearSearch={() => undefined}
                      onApplySuggestion={() => undefined}
                    />
                  </Box>
                  <Box label="FilteredEmptyState">
                    <FilteredEmptyState onClearFilters={() => undefined} />
                  </Box>
                  <Box label="CatalogErrorState">
                    <CatalogErrorState onRetry={() => undefined} />
                  </Box>
                </div>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "Pendiente de documentación",
                    node: (
                      <p className="text-[11px] italic text-muted-foreground text-center">
                        Cada empty-state es estático — ver Variantes.
                      </p>
                    ),
                  },
                ]}
              />
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Tabla de decisión
                </h3>
                <div className="overflow-x-auto rounded-card border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Cuando</th>
                        <th className="px-3 py-2 text-left font-semibold">Renderiza</th>
                        <th className="px-3 py-2 text-left font-semibold">Razón</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DECISIONS.map((d) => (
                        <tr key={d.when} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs text-foreground">{d.when}</td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{d.render}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{d.reason}</td>
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

function Box({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <DSCatalogDemoWrapper>{children}</DSCatalogDemoWrapper>
    </div>
  );
}
