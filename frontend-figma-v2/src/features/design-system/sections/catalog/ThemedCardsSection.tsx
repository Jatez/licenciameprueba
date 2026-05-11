import { ThemedCards } from "@/modules/tracks/components/ThemedCards/ThemedCards";
import { toast } from "sonner";
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

const PRESETS = [
  { id: "reels", filters: "durationRange 0-60s · platforms IG+TT", purpose: "Tracks cortos y pegadizos para Reels e historias." },
  { id: "events", filters: "genres latin/pop/rock", purpose: "Energía alta para activaciones en vivo." },
  { id: "corporate", filters: "genres corporate/ambient/cinematic", purpose: "Música institucional y elegante." },
  { id: "podcasts", filters: "moods calmado/ambiental + acoustic/folk", purpose: "Bases sutiles que no compiten con la voz." },
];

const ANATOMY = [
  { name: "Section header", desc: "h2 'Descubre por tipo de contenido'." },
  { name: "<ul> grid 1/2/4", desc: "4 ThemedCard, una por preset." },
  { name: "ThemedCard", desc: "Adapter sobre <ImageOverlayCard /> con preset gradient-bottom · 8/5 · scale." },
];

const TOKENS = [
  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "gap-3",
  "aspect-ratio 8/5 (ImageOverlayCard preset)",
  "overlayStyle gradient-bottom",
  "hoverEffect scale (1.04)",
];

const A11Y = [
  "<section aria-labelledby='themed-cards-title'> envuelve el grid.",
  "Cada card es un <button> con aria-label compuesto del título.",
  "ImageOverlayCard maneja el alt de la imagen internamente.",
  "Los presets se aplican vía onApply(filters) — no navegan, mutan los filtros del catálogo.",
];

const DOS = [
  "Mostrar ThemedCards SOLO cuando hasActiveFilters === false (evita ruido).",
  "Respetar el feature flag FEATURE_THEMED_CARDS — el bloque es opcional.",
  "Conectar onApply al setFilters del catálogo (URL state).",
  "Mantener exactamente 4 presets — el grid colapsa a 1/2/4 sin huérfanos.",
];

const DONTS = [
  "Renderizar ThemedCards mientras hay filtros activos — duplicaría intención.",
  "Permitir navegación al detail desde el card — el contrato es 'aplicar filtros'.",
  "Inventar más presets sin consenso — mantener taxonomía estable.",
  "Reimplementar la card aquí — usar ImageOverlayCard del DS (ver Components/ImageOverlayCard).",
];

const SNIPPET = `import { ThemedCards } from "@/modules/tracks/components/ThemedCards";

{!hasActiveFilters && (
  <ThemedCards onApply={(patch) => setFilters(patch)} />
)}`;

export function ThemedCardsSection() {
  return (
    <>
      <DSSectionHeader
        id="themed-cards"
        title={`Themed Cards — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<ThemedCards /> · <ThemedCard /> → <ImageOverlayCard />"
      />
      <DSComponentSpec
        description="4 presets temáticos al inicio del catálogo. Click aplica filtros precargados (no navega). Migrado en Prompt 5 a ImageOverlayCard variant='themed' — cross-ref Components/ImageOverlayCard."
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
                Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog</code> (sin filtros)
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
                <DSCatalogDemoWrapper>
                  <ThemedCards
                    onApply={(patch) =>
                      toast.success("Filtros aplicados", {
                        description: JSON.stringify(patch),
                      })
                    }
                  />
                </DSCatalogDemoWrapper>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "Pendiente de documentación",
                    node: (
                      <p className="text-[11px] italic text-muted-foreground text-center">
                        Estados no documentados — el componente es siempre estático.
                      </p>
                    ),
                  },
                ]}
              />
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  4 presets canónicos
                </h3>
                <div className="overflow-x-auto rounded-card border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">id</th>
                        <th className="px-3 py-2 text-left font-semibold">Filtros aplicados</th>
                        <th className="px-3 py-2 text-left font-semibold">Intención</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRESETS.map((p) => (
                        <tr key={p.id} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs text-foreground">{p.id}</td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.filters}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{p.purpose}</td>
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
