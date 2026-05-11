import { SimilarTracks } from "@/modules/tracks/components/SimilarTracks";
import { SimilarTracksSkeleton } from "@/modules/tracks/components/SimilarTracks/SimilarTracksSkeleton";
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
import { MOCK_TRACKS_SIMILAR } from "./_shared/mocks";

const TODAY = "2026-04-24";
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "Section header", desc: "h2 'Canciones similares' + subtítulo 'Basado en el género {genre}'." },
  { name: "Grid 2/3/6", desc: "<ul> grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 — denso." },
  { name: "SimilarTrackCard", desc: "Cover aspect-square + play overlay + título + artista. Más compacto que TrackCard (sin platforms / sin Licenciar)." },
];

const TOKENS = [
  "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  "gap-4",
  "aspect-square (cover)",
  "rounded-card",
  "ring-2 ring-primary (active)",
];

const A11Y = [
  "<section aria-labelledby='similar-tracks-title'> envuelve el bloque.",
  "<ul> + <li> — semántica de lista.",
  "Cada card es un <button> que navega al detail (focus + Enter).",
  "Si tracks.length === 0 el componente devuelve null — sin headers huérfanos.",
];

const DOS = [
  "Pasar genre del track actual para construir el subtítulo.",
  "Renderizar SimilarTracks solo si FEATURE_SIMILAR_TRACKS ON y similarTracks?.length > 0.",
  "Mostrar el skeleton mientras carga la query del detail (no como bloque separado).",
  "Mantener máx 6 cards — más satura el detail.",
];

const DONTS = [
  "Renderizar headers sin tracks — el componente devuelve null pero conviene no instanciarlo.",
  "Reutilizar TrackCard en vez de SimilarTrackCard — la densidad es distinta.",
  "Cambiar el grid a 4 columnas — pierde la escala 'recomendaciones'.",
  "Quitar el active ring — rompe sincronía con el player global.",
];

const SNIPPET = `import { SimilarTracks } from "@/modules/tracks/components/SimilarTracks";

{similarFlag && similarTracks && similarTracks.length > 0 ? (
  <SimilarTracks tracks={similarTracks} genre={track.genre} />
) : null}`;

export function SimilarTracksSection() {
  return (
    <>
      <DSSectionHeader
        id="similar-tracks"
        title={`Similar Tracks — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<SimilarTracks /> · <SimilarTrackCard /> · <SimilarTracksSkeleton />"
      />
      <DSComponentSpec
        description="Grid de hasta 6 tracks recomendados según género/popularidad del track actual. Cards más compactas que TrackCard (sin platforms / sin CTA Licenciar)."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
                href="/catalog/track/mock-popular"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog/track/mock-popular</code>
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
                  <SimilarTracks tracks={MOCK_TRACKS_SIMILAR} genre="latin" />
                </DSCatalogDemoWrapper>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "loading skeleton",
                    node: (
                      <div className="w-full">
                        <SimilarTracksSkeleton />
                      </div>
                    ),
                  },
                  {
                    label: "empty (returns null)",
                    node: (
                      <p className="text-[11px] text-muted-foreground text-center">
                        tracks.length === 0 → null
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
