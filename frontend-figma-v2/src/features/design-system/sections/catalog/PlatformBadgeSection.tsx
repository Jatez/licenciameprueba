import { PlatformBadge } from "@/components/ui/platform-badge";
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

const TODAY = "2026-04-24";
const VERSION = "v1.0.0";
const SIZES = ["xs", "sm", "md", "lg"] as const;
const PLATFORMS = ["instagram", "tiktok", "facebook"] as const;

const ANATOMY = [
  { name: "Container chip", desc: "rounded-full bg-foreground (negro). Sizes xs(20)/sm(24)/md(32)/lg(40)." },
  { name: "Icon", desc: "Lucide Instagram/Music2/Facebook con text-background (blanco)." },
  { name: "Optional label", desc: "withLabel renderiza nombre de plataforma al lado." },
];

const TOKENS = [
  "rounded-full",
  "bg-foreground",
  "text-background",
  "h-5 w-5 / h-6 w-6 / h-8 w-8 / h-10 w-10",
  "shrink-0",
];

const A11Y = [
  "Sin label: role='img' + aria-label='Instagram|TikTok|Facebook'.",
  "Con label: el chip es decorativo (aria-hidden via icon), el texto adyacente comunica.",
  "Atenuado (no licenciable): el padre debe envolver con tooltip o aria-label explicativo.",
  "Iconos lucide siempre con aria-hidden='true'.",
];

const DOS = [
  "Usar PlatformBadge para TODOS los logos de IG/TT/FB en el producto.",
  "Diferenciar por icono — no por color de fondo.",
  "Pasar withLabel cuando el contexto no deja claro qué plataforma es (e.g. listas de conexiones).",
  "Aplicar opacity-30 sobre el badge cuando la plataforma no esté licenciable.",
];

const DONTS = [
  "Instanciar <Instagram />, <Music2 />, <Facebook /> directamente en features.",
  "Cambiar el bg-foreground por colores de marca — rompe la unidad visual.",
  "Usar size='xs' con label — el chip queda más chico que el texto y se ve raro.",
  "Anidar PlatformBadge dentro de otro <button> sin propagar el aria-label.",
];

const SNIPPET = `import { PlatformBadge } from "@/components/ui/platform-badge";

// Solo chip
<PlatformBadge platform="instagram" size="sm" />

// Con label
<PlatformBadge platform="tiktok" withLabel />

// Atenuado (no licenciable)
<PlatformBadge platform="facebook" className="opacity-30" />`;

export function PlatformBadgeSection() {
  return (
    <>
      <DSSectionHeader
        id="platform-badge"
        title={`Platform Badge — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<PlatformBadge /> · <PlatformIcons /> · <PlatformIcon />"
      />
      <DSComponentSpec
        description="Logo unificado de apps sociales (Instagram, TikTok, Facebook). Chip circular bg-foreground (negro) con icono text-background (blanco). REGLA DEL DS: TODOS los logos de IG/TT/FB del producto usan este recipe — no instanciar lucide directo. La diferenciación visual viene del icono mismo, no del color de fondo."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens tokens={TOKENS} />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6 rounded-card border border-border bg-card p-5">
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tamaños
                    </h4>
                    <div className="space-y-3">
                      {SIZES.map((size) => (
                        <div key={size} className="flex items-center gap-4">
                          <code className="w-10 text-xs text-muted-foreground">{size}</code>
                          <div className="flex items-center gap-2">
                            {PLATFORMS.map((p) => (
                              <PlatformBadge key={p} platform={p} size={size} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Con label
                    </h4>
                    <div className="flex flex-wrap items-center gap-4">
                      {PLATFORMS.map((p) => (
                        <PlatformBadge key={p} platform={p} size="sm" withLabel />
                      ))}
                    </div>
                  </div>
                </div>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "default",
                    node: <PlatformBadge platform="instagram" size="md" />,
                  },
                  {
                    label: "with label",
                    node: <PlatformBadge platform="tiktok" withLabel />,
                  },
                  {
                    label: "denied",
                    className: "opacity-30",
                    node: <PlatformBadge platform="facebook" size="md" className="opacity-30" />,
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
