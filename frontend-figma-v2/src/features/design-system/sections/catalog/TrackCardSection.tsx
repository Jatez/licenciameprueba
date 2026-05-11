import { TrackCard } from "@/modules/tracks/components/TrackCard";
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
  { name: "Media (cover + play overlay)", desc: "Aspect-square. Si no hay coverUrl, placeholder Music. TrackPreviewButton overlay con scale en hover." },
  { name: "Body (button → detail)", desc: "Título line-clamp-1, artista, género · duración. Click navega a /catalog/track/:id." },
  { name: "Footer", desc: "PlatformIcons (chips IG/TT/FB con opacidad por licenciabilidad) + favorito + Botón Licenciar." },
  { name: "Active ring", desc: "ring-2 ring-primary cuando el track está activo en el player global." },
];

const TOKENS = [
  "rounded-card",
  "border border-border",
  "bg-surface",
  "aspect-square (media)",
  "ring-2 ring-primary (active)",
  "group-hover:scale-[1.03] (cover zoom)",
  "line-clamp-1 (title/artist)",
  "fill-error text-error (favorito on)",
];

const A11Y = [
  "<article aria-labelledby> con id único por track.",
  "Body es <button> — navegación por teclado (Enter/Space).",
  "PlayButton stop-propagates click → no dispara navigate.",
  "Cover <img alt> compuesto: 'Carátula de {title} de {artist}'.",
  "Favorito expone aria-pressed + aria-label dinámico (agregar/quitar).",
];

const DOS = [
  "Wrap el card en <li> dentro de un <ul> para semántica de lista.",
  "Pasar TrackSummary completo — el card decide qué mostrar.",
  "Confiar en memo(TrackCard) — re-renders solo si la referencia del track cambia.",
  "Stop-propagation en play y favorite para que no naveguen al detail.",
];

const DONTS = [
  "Quitar el placeholder Music cuando no hay cover — daña el grid.",
  "Renderizar el TrackCard fuera de un Router — depende de useNavigate. En la app vive bajo el BrowserRouter de App.tsx.",
  "Reemplazar el botón Licenciar con link <a> — la navegación va con state.",
  "Mostrar 'Licenciar' deshabilitado sin tooltip de razón — el usuario no entiende por qué.",
];

const SNIPPET = `import { TrackCard } from "@/modules/tracks/components/TrackCard";

<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
  {tracks.map((t) => (
    <li key={t.id}>
      <TrackCard track={t} />
    </li>
  ))}
</ul>`;

export function TrackCardSection() {
  return (
    <>
      <DSSectionHeader
        id="track-card"
        title={`Track Card — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<TrackCard /> · <TrackCardFavorite />"
      />
      <DSComponentSpec
        description="Card de track para vista grid: cover cuadrado con play overlay, título, artista, género, duración, plataformas licenciables, favorito y CTA Licenciar. Click en el body navega al detail; play y favorite no propagan."
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
                <DSCatalogDemoWrapper>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {MOCK_TRACKS.map((t) => (
                      <li key={t.id}>
                        <TrackCard track={t} />
                      </li>
                    ))}
                  </ul>
                </DSCatalogDemoWrapper>
                <p className="mt-3 text-xs text-muted-foreground">
                  Variantes: 1) favorite-on (Latin Heat), 2) default (Slow Burn), 3) sin cover (Boardroom), 4) default (Neon Run).
                </p>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "default",
                    node: (
                      <DSCatalogDemoWrapper frame="none">
                        <div className="w-32">
                          <TrackCard track={MOCK_TRACKS[1]} />
                        </div>
                      </DSCatalogDemoWrapper>
                    ),
                  },
                  {
                    label: "favorite-on",
                    node: (
                      <DSCatalogDemoWrapper frame="none">
                        <div className="w-32">
                          <TrackCard track={MOCK_TRACKS[0]} />
                        </div>
                      </DSCatalogDemoWrapper>
                    ),
                  },
                  {
                    label: "no cover",
                    node: (
                      <DSCatalogDemoWrapper frame="none">
                        <div className="w-32">
                          <TrackCard track={MOCK_TRACKS[2]} />
                        </div>
                      </DSCatalogDemoWrapper>
                    ),
                  },
                  {
                    label: "loading",
                    node: (
                      <div className="flex w-full flex-col gap-1.5">
                        <Skeleton className="aspect-square w-full rounded-card" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
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
