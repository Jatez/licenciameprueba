import { useState } from "react";
import { CatalogPagination } from "@/modules/tracks/components/CatalogPagination";
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

const ANATOMY = [
  { name: "Prev / Next", desc: "Links con ChevronLeft/Right + label visible ≥sm. aria-disabled cuando no aplica." },
  { name: "Compact label (sm:flex md:hidden)", desc: "'Página X de Y' en mobile/tablet — más legible que números." },
  { name: "Number links (md:list-item)", desc: "Páginas individuales. aria-current='page' en activa." },
  { name: "Ellipsis", desc: "Renderiza MoreHorizontal cuando hay gap entre rangos." },
];

const TOKENS = [
  "gap-1 (PaginationContent)",
  "h-9 w-9 (link button)",
  "rounded-md",
  "buttonVariants ghost / outline (active)",
  "opacity-50 (disabled prev/next)",
];

const A11Y = [
  "<nav role='navigation' aria-label='pagination'> contenedor.",
  "Página activa: aria-current='page'.",
  "Prev/Next: aria-label + aria-disabled cuando bloqueado.",
  "Atajo de teclado: ←/→ navegan páginas (escucha global, ignora inputs).",
  "Ellipsis con aria-hidden + sr-only 'More pages'.",
];

const DOS = [
  "Mostrar pagination solo si totalPages > 1 (el componente lo verifica internamente).",
  "Pasar onPageChange controlado desde useCatalogUrlState — actualiza la URL.",
  "Mantener disabled visual + aria-disabled en bordes.",
  "Soportar el atajo ←/→ — ya viene incluido.",
];

const DONTS = [
  "Renderizar pagination con totalPages === 1 — el componente devuelve null pero conviene no instanciarlo.",
  "Implementar el rango manual — usar buildPaginationRange del módulo.",
  "Bloquear el atajo ←/→ — está pensado para power users.",
  "Mostrar TODAS las páginas sin ellipsis — escala mal con > 10 páginas.",
];

const SNIPPET = `import { CatalogPagination } from "@/modules/tracks/components/CatalogPagination";

<CatalogPagination
  page={data?.page ?? page}
  totalPages={data?.totalPages ?? 1}
  onPageChange={setPage}
/>`;

export function CatalogPaginationSection() {
  return (
    <>
      <DSSectionHeader
        id="catalog-pagination"
        title={`Catalog Pagination — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<CatalogPagination />"
      />
      <DSComponentSpec
        description="Paginador con prev/next, números, ellipsis. Soporta navegación por arrows del teclado fuera de inputs. Renderiza null cuando totalPages <= 1."
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
                  <Variant label="Pocas páginas (sin ellipsis)">
                    <PaginationDemo total={3} initial={1} />
                  </Variant>
                  <Variant label="Muchas páginas (con ellipsis)">
                    <PaginationDemo total={50} initial={5} />
                  </Variant>
                  <Variant label="Última página (next deshabilitado)">
                    <PaginationDemo total={50} initial={50} />
                  </Variant>
                </div>
              </DSVariants>
              <DSStates
                states={[
                  { label: "page 1 (prev disabled)", node: <PaginationDemo total={5} initial={1} /> },
                  { label: "page 5/5 (next disabled)", node: <PaginationDemo total={5} initial={5} /> },
                  {
                    label: "1 página (no renderiza)",
                    node: (
                      <p className="text-[11px] text-muted-foreground text-center">
                        totalPages=1 → null
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

function PaginationDemo({ total, initial }: { total: number; initial: number }) {
  const [page, setPage] = useState(initial);
  return (
    <DSCatalogDemoWrapper>
      <CatalogPagination page={page} totalPages={total} onPageChange={setPage} />
    </DSCatalogDemoWrapper>
  );
}
