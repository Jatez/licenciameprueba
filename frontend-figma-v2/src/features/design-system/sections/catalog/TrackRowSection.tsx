import { TrackRow } from "@/modules/tracks/components/TrackRow";
import { Skeleton } from "@/components/ui/skeleton";
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
  { name: "Cover (48px) + play overlay", desc: "Mini cover redondeado con TrackPreviewButton size='sm'." },
  { name: "Body (button → detail)", desc: "Título + artista line-clamp-1." },
  { name: "Meta (≥sm)", desc: "Género y duración. Ocultos en mobile para liberar ancho." },
  { name: "PlatformIcons", desc: "3 chips compactos con opacidad por licenciabilidad." },
  { name: "Actions", desc: "Favorito + botón Licenciar." },
];

const TOKENS = [
  "rounded-card",
  "border border-border",
  "bg-surface",
  "px-3 py-2 (denser que TrackCard)",
  "h-12 w-12 rounded-md (cover)",
  "ring-2 ring-primary (active)",
  "hidden sm:block (género/duración)",
];

const A11Y = [
  "<article aria-labelledby> con id único.",
  "Body es <button> — click navega; play y favorite stop-propagation.",
  "Mismo aria-label de cover y de play que TrackCard.",
  "Hidden sm:block en meta — accesible para screen readers en cualquier viewport.",
];

const DOS = [
  "Reservar TrackRow para listas densas (viewMode='list', resultados largos, similares estilo tabla).",
  "Mantener consistencia con TrackCard en aria-labels y stop-propagation.",
  "Wrap en <li> dentro de <ul> con space-y-2.",
  "Confiar en memo(TrackRow) — re-render solo si la referencia del track cambia.",
];

const DONTS = [
  "Usar TrackRow en grids — pierde la densidad y los chips se cortan.",
  "Mostrar género/duración en mobile — el ancho colapsa.",
  "Ocultar el favorito en row — la altura ya es compacta, el corazón sigue siendo discoverable.",
  "Quitar el ring-2 del active — perderías la sincronía visual con el player.",
];

const SNIPPET = `import { TrackRow } from "@/modules/tracks/components/TrackRow";

<ul className="space-y-2">
  {tracks.map((t) => (
    <li key={t.id}>
      <TrackRow track={t} />
    </li>
  ))}
</ul>`;

export function TrackRowSection() {
  return (
    <>
      <DSSectionHeader
        id="track-row"
        title={`Track Row — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<TrackRow />"
      />
      <DSComponentSpec
        description="Fila densa para vista lista (viewMode='list'). Cover 48px, título + artista, meta opcional desde sm, plataformas, favorito y CTA Licenciar. Variante compacta de TrackCard, mismo modelo de interacción."
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
                Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog</code> (toggle list)
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
                  <ul className="space-y-2">
                    {MOCK_TRACKS.map((t) => (
                      <li key={t.id}>
                        <TrackRow track={t} />
                      </li>
                    ))}
                  </ul>
                </DSCatalogDemoWrapper>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "default",
                    node: (
                      <DSCatalogDemoWrapper frame="none" className="w-full">
                        <TrackRow track={MOCK_TRACKS[1]} />
                      </DSCatalogDemoWrapper>
                    ),
                  },
                  {
                    label: "favorite-on",
                    node: (
                      <DSCatalogDemoWrapper frame="none" className="w-full">
                        <TrackRow track={MOCK_TRACKS[0]} />
                      </DSCatalogDemoWrapper>
                    ),
                  },
                  {
                    label: "no cover",
                    node: (
                      <DSCatalogDemoWrapper frame="none" className="w-full">
                        <TrackRow track={MOCK_TRACKS[2]} />
                      </DSCatalogDemoWrapper>
                    ),
                  },
                  {
                    label: "loading",
                    node: <Skeleton className="h-16 w-full rounded-card" />,
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
