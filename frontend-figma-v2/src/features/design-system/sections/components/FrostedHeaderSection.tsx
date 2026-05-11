import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

/**
 * Mock tracks for the scrollable backdrop of FrostedHeader demos.
 * Source: Unsplash (Unsplash License — free, commercial use allowed, no
 * attribution required). Reused from `src/features/metrics/mocks/tracks.ts`.
 */
const DEMO_TRACKS = [
  { id: "t1", title: "Neon Pulse",     artist: "Lúa Romero",    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { id: "t2", title: "Cielo Roto",     artist: "Mateo Vega",    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },
  { id: "t3", title: "Bossa Verde",    artist: "Aldea Nueve",   cover: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&q=80" },
  { id: "t4", title: "Lo Que Queda",   artist: "Sara Clavijo",  cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },
  { id: "t5", title: "Madrugada FM",   artist: "Quintino",      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80" },
  { id: "t6", title: "Trópico Eléctrico", artist: "Río Calderón", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
];

const ANATOMY = [
  { name: "wrapper", desc: "Posición sticky (default) con z-20 y transición de transform para show/hide on scroll." },
  { name: "position", desc: "'top' (default) → sticky-top, gradient sólido arriba. 'bottom' → sticky-bottom, gradient sólido abajo (footer de wizards)." },
  { name: "background", desc: "linear-gradient vertical desde el color base hasta transparente, en la dirección que indique `position`." },
  { name: "blur", desc: "backdrop-filter: blur(8|12|20px) según intensidad — desenfoca el contenido que pasa por debajo." },
  { name: "children", desc: "Slot único: contenido propio del feature (DashboardHeader, WizardStepper, footer de acciones, etc.)." },
];

const A11Y = [
  "El gradient garantiza contraste del texto en el borde sólido; sobre el área translúcida usa siempre tipografías sólidas (no opacidades adicionales).",
  "Se respeta @media (prefers-reduced-transparency: reduce) en .sticky-frosted-header (background opaco como fallback).",
  "Para el componente, considera pasar baseRgb desde un token sólido si el usuario tiene la preferencia activada (TODO: hook useReducedTransparency en Prompt 6).",
  "No introduce roles ARIA — es decoración estructural; los landmarks van dentro de children.",
];

const DOS = [
  "ESTÁNDAR GLOBAL para page headers de vistas con scroll vertical largo (Dashboard, Catalog, Licensing wizard, futuros: Wallet, Monitoring). Toda nueva página/wizard con header sticky debe usar esta receta.",
  "En page headers (position='top') combínalo SIEMPRE con useHeadroom() para mostrar/ocultar al scrollear.",
  "En wizards: usa position='top' para header+stepper Y position='bottom' para el footer de acciones, ambos edge-to-edge del contenedor padre vía negative margins (-mx-4 -mt-14 / md:-mx-10 -mt-12 contra el BodyCard).",
  "Para BREADCRUMBS sticky en vistas de detalle (Track Detail) y wizards (Licensing): envuelve el botón 'Volver' en un FrostedHeader top + useHeadroom. Si hay breadcrumb + header en el mismo bloque, apila ambos FrostedHeader (sticky={false}) dentro de un único contenedor sticky externo con un solo useHeadroom — así breadcrumb y header se mueven como una unidad.",
  "Reutiliza la misma className de padding/margins que Dashboard v2, Catalog y Licensing para mantener la silueta visual consistente.",
];

const DONTS = [
  "No lo uses para navbars opacas (ej. DSTopBar) — son bg-card sólidos, no necesitan blur.",
  "No lo uses como sustituto del AppSidebar (ése usa sidebar-frosted, blur 60px, recipe distinta).",
  "No agregues padding propio al wrapper — el espaciado se aplica con className.",
  "NO apliques useHeadroom() al footer (position='bottom') de un wizard — las acciones primarias (Anterior/Siguiente/Confirmar) deben permanecer SIEMPRE accesibles.",
];

const CODE_TOP = `// Page header (Dashboard, Catalog, …)
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";

const { isVisible } = useHeadroom();

<FrostedHeader
  position="top"
  intensity="default"
  translateY={isVisible ? "0" : "-100%"}
  className="-mx-4 -mt-14 px-4 pt-4 pb-4 md:-mx-10 md:-mt-12 md:px-10 md:pt-12 md:pb-6"
>
  <DashboardHeader … />
</FrostedHeader>`;

// TODO(layout-tokens): el contenedor `mx-auto w-full max-w-3xl` que envuelve
// LicensingWizardFooter es un patrón "article-width" repetido en wizards.
// Decisión pendiente:
//   (a) extraer a un token de layout (`--width-article` / `max-w-article`)
//       declarado en tailwind.config.ts, o
//   (b) extender DSSectionBody con `width="article"` (max-w-3xl) y migrar
//       todos los call-sites de wizards.
// Mientras tanto, este snippet documenta el patrón actual sin abstraerlo
// para no romper el ejemplo real del producto.
const CODE_BOTTOM = `// Wizard footer (Licensing, futuros wizards)
<FrostedHeader
  position="bottom"
  intensity="default"
  className="-mx-4 -mb-6 px-4 pt-4 pb-4 md:-mx-10 md:-mb-12 md:px-10 md:pt-6 md:pb-8"
>
  <div className="mx-auto w-full max-w-3xl">
    <LicensingWizardFooter … />
  </div>
</FrostedHeader>`;

const CODE = `${CODE_TOP}\n\n${CODE_BOTTOM}`;

function DemoBackdrop() {
  return (
    <div className="px-4 py-3 space-y-3">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Scrolea este panel para ver el efecto frosted en acción. El header se mantiene
        fijo y desenfoca las thumbnails y el texto que pasan por debajo.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DEMO_TRACKS.map((tr) => (
          <div key={tr.id} className="flex items-center gap-2 rounded-md bg-card p-2">
            <img
              src={tr.cover}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-10 w-10 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{tr.title}</p>
              <p className="truncate text-[11px] text-muted-foreground">{tr.artist}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 pt-2">
        <div className="h-2.5 rounded bg-muted w-3/4" />
        <div className="h-2.5 rounded bg-muted w-2/3" />
        <div className="h-2.5 rounded bg-muted w-4/5" />
        <div className="h-2.5 rounded bg-muted w-1/2" />
        <div className="h-2.5 rounded bg-muted w-3/5" />
      </div>
    </div>
  );
}

function FrostedHeaderDemo({
  intensity,
  position = "top",
}: {
  intensity: "subtle" | "default" | "strong";
  position?: "top" | "bottom";
}) {
  const isBottom = position === "bottom";
  return (
    <div className="rounded-card border border-border overflow-y-auto bg-bodycard-bg h-[360px] relative">
      {!isBottom && (
        <FrostedHeader
          position="top"
          intensity={intensity}
          sticky
          className="px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Header — {intensity}</span>
            <span className="text-xs text-muted-foreground font-tnum">04:23</span>
          </div>
        </FrostedHeader>
      )}
      {/* Scrollable real content so the blur is actually visible. */}
      <DemoBackdrop />
      <DemoBackdrop />
      {isBottom && (
        <FrostedHeader
          position="bottom"
          intensity={intensity}
          sticky
          className="px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">← Anterior</span>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-ink-900">
              Siguiente →
            </span>
          </div>
        </FrostedHeader>
      )}
    </div>
  );
}

export function FrostedHeaderSection() {
  return (
    <>
      <DSSectionHeader
        id="frosted-header"
        title="FrostedHeader"
        status="stable"
        lastUpdate={TODAY}
        componentName="<FrostedHeader /> · .sticky-frosted-header"
      />
      <DSComponentSpec
        description="Receta encapsulada del 'sticky frosted bar' usada en page headers (Dashboard, Catalog) Y en footers de wizards (Licensing). Reemplaza el patrón inline `style={{ background: 'linear-gradient(...)', backdropFilter: 'blur(12px)' }}` repetido en features. Soporta `position='top'` (default) y `position='bottom'` con gradient invertido. Disponible también como utility CSS (.sticky-frosted-header)."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "position='top' (default)  → sticky top-0,    gradient 180deg (sólido arriba → transparente abajo)",
                  "position='bottom'          → sticky bottom-0, gradient 0deg   (sólido abajo  → transparente arriba)",
                  "intensity='subtle'  → blur(8px)  · solid translucent (rgba 0.85)",
                  "intensity='default' → blur(12px) · gradient 100→0%",
                  "intensity='strong'  → blur(20px) · gradient 100→75→0%",
                  "baseRgb default = '243, 244, 246' (= bodycard-bg)",
                  "z-20 (sticky · queda bajo el sidebar z-50)",
                  "transition-transform 300ms ease-in-out",
                  "Hook obligatorio en page headers: useHeadroom() de @/shared/hooks — devuelve { isVisible } para alimentar translateY. NO usar en footers de wizard.",
                  "Callsites de referencia: DashboardLayoutV2.tsx · CatalogPage.tsx · LicensingWizardLayout.tsx (top + bottom).",
                  "Relación con navbar-frosted (token CSS): navbar-frosted es para top-navbars OPACAS sobre fondo oscuro. FrostedHeader es para sticky bars TRANSLÚCIDAS sobre contenido claro. Conviven.",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      position = top · intensity = subtle
                    </p>
                    <FrostedHeaderDemo intensity="subtle" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      position = top · intensity = default (recomendado para page headers)
                    </p>
                    <FrostedHeaderDemo intensity="default" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      position = top · intensity = strong
                    </p>
                    <FrostedHeaderDemo intensity="strong" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      position = bottom · intensity = default (footer de wizard)
                    </p>
                    <FrostedHeaderDemo intensity="default" position="bottom" />
                  </div>
                </div>
              </DSVariants>
              <DSCode snippet={CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
