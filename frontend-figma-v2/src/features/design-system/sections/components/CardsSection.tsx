import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSUsage,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
} from "../../components/spec";

const TODAY = "2026-04-24";

interface DecisionRow {
  useCase: string;
  component: string;
  variants: string;
  anchor?: string;
  thumb?: "kpi" | "image-overlay" | "track" | "themed" | "card" | "body" | "empty";
}

const DECISION_MATRIX: DecisionRow[] = [
  {
    useCase: "KPI con cifra grande",
    component: "<KPICard />",
    variants: "dark · sparkline · stripes · countdown",
    anchor: "kpi-card",
    thumb: "kpi",
  },
  {
    useCase: "Tarjeta visual con imagen + overlay",
    component: "<ImageOverlayCard />",
    variants: "gradient-bottom · gradient-full · blur-panel",
    anchor: "image-overlay-card",
    thumb: "image-overlay",
  },
  {
    useCase: "Track del catálogo (cover + metadata)",
    component: "<TrackCard />",
    variants: "Adapter sobre ImageOverlayCard",
    anchor: "track-card",
    thumb: "track",
  },
  {
    useCase: "Categoría / Mood (preset de filtros)",
    component: "<CategoryCard /> · <MoodCard />",
    variants: "Adapters sobre ImageOverlayCard",
    anchor: "themed-cards",
    thumb: "themed",
  },
  {
    useCase: "Card genérica de contenido textual",
    component: "<Card /> (shadcn)",
    variants: "Composición vía className",
    thumb: "card",
  },
  {
    useCase: "Container flotante de página",
    component: "<BodyCard />",
    variants: "layout primitive",
    anchor: "body-card",
    thumb: "body",
  },
  {
    useCase: "Empty state",
    component: "<EmptyStateCard />",
    variants: "default",
    anchor: "empty-state-card",
    thumb: "empty",
  },
];

/**
 * Tiny visual thumbnails (80×60) rendered with pure tokens — no images.
 * Each one is a stripped-down silhouette of the corresponding component
 * so the user gets a visual hint before clicking the anchor.
 */
function DecisionThumb({ kind }: { kind: NonNullable<DecisionRow["thumb"]> }) {
  switch (kind) {
    case "kpi":
      return (
        <div className="w-20 h-[60px] rounded-md bg-foreground p-1.5 flex flex-col justify-between">
          <div className="h-1 w-6 bg-background/40 rounded-sm" />
          <div className="text-background text-[14px] font-bold leading-none font-tnum">35</div>
          <div className="h-2 w-full bg-gradient-to-t from-background/30 to-transparent rounded-sm" />
        </div>
      );
    case "image-overlay":
      return (
        <div className="w-20 h-[60px] rounded-md bg-gradient-to-br from-lm-gray-400 to-lm-gray-700 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute left-1.5 bottom-1 h-1 w-8 bg-background rounded-sm" />
        </div>
      );
    case "track":
      return (
        <div className="w-20 h-[60px] rounded-md bg-gradient-to-br from-primary/40 to-primary/10 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute right-1.5 top-1.5 h-3 w-3 rounded-full bg-primary" />
          <div className="absolute left-1.5 bottom-1 h-1 w-6 bg-background rounded-sm" />
        </div>
      );
    case "themed":
      return (
        <div className="w-20 h-[60px] rounded-md bg-gradient-to-br from-metric/30 to-info/20 relative overflow-hidden">
          <div className="absolute inset-x-1 bottom-1 h-2 bg-background/80 rounded-sm" />
        </div>
      );
    case "card":
      return (
        <div className="w-20 h-[60px] rounded-md bg-card border border-border p-1.5 flex flex-col gap-1">
          <div className="h-1 w-10 bg-foreground/60 rounded-sm" />
          <div className="h-1 w-12 bg-muted-foreground/40 rounded-sm" />
          <div className="h-1 w-8 bg-muted-foreground/40 rounded-sm" />
        </div>
      );
    case "body":
      return (
        <div className="w-20 h-[60px] rounded-md bg-sidebar-bg p-1 flex">
          <div className="w-2 h-full rounded-sm bg-card mr-1" />
          <div className="flex-1 h-full bg-bodycard-bg rounded-sm" />
        </div>
      );
    case "empty":
      return (
        <div className="w-20 h-[60px] rounded-md bg-card border border-dashed border-border flex flex-col items-center justify-center gap-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
          <div className="h-1 w-8 bg-muted-foreground/30 rounded-sm" />
        </div>
      );
  }
}

export function CardsSection() {
  const { t } = useTranslation("designSystem");
  const a11y = t("spec.cards.a11y", { returnObjects: true }) as string[];

  const dos = [
    "Elige el componente de la tabla según el caso de uso, no por estética.",
    "Si necesitas una variante nueva, propónla como variant del componente correspondiente — no crees un duplicado.",
    "Para cards complejas (muchas zonas), usa un adapter sobre la primitiva en vez de reinventar.",
  ];

  const donts = [
    "No uses <Card /> shadcn para tarjetas con imagen — usa <ImageOverlayCard />.",
    "No re-implementes radii, sombras o tipografía — los componentes ya consumen tokens.",
    "No mezcles dos primitivas distintas en la misma vista (mantén consistencia visual).",
  ];

  return (
    <>
      <DSSectionHeader
        id="cards"
        title={t("sections.cards.title")}
        status="stable"
        lastUpdate={TODAY}
        componentName="Decision map · KPICard · ImageOverlayCard · Card · BodyCard · EmptyStateCard"
      />
      <DSComponentSpec
        description="No existe una sola card 'genérica'. El sistema tiene primitivas especializadas por caso de uso. Esta sección es el mapa de decisión: dado un escenario, qué componente usar."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSUsage dos={dos} donts={donts} />
              <DSCollapsibleA11y items={a11y} />
              <DSCollapsibleTokens
                tokens={[
                  "rounded-card (20px)",
                  "bg-card",
                  "border-border",
                  "shadow-sm",
                  "p-6",
                  "hover:bg-muted",
                ]}
              />
            </>
          }
          right={
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Tabla de decisión</h3>
              <div className="bg-card rounded-card border border-border overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-semibold text-foreground w-24">Demo</th>
                      <th className="text-left p-3 font-semibold text-foreground">Caso de uso</th>
                      <th className="text-left p-3 font-semibold text-foreground">Componente</th>
                      <th className="text-left p-3 font-semibold text-foreground">Variantes / notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DECISION_MATRIX.map((row) => (
                      <tr key={row.useCase} className="border-t border-border align-top">
                        <td className="p-3">
                          {row.thumb &&
                            (row.anchor ? (
                              <a
                                href={`#${row.anchor}`}
                                aria-label={`Ir a ${row.component}`}
                                className="inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <DecisionThumb kind={row.thumb} />
                              </a>
                            ) : (
                              <DecisionThumb kind={row.thumb} />
                            ))}
                        </td>
                        <td className="p-3 text-foreground">{row.useCase}</td>
                        <td className="p-3">
                          {row.anchor ? (
                            <a
                              href={`#${row.anchor}`}
                              className="inline-flex items-center gap-1 text-xs bg-muted px-1.5 py-0.5 rounded text-foreground hover:bg-primary-subtle transition-colors"
                            >
                              <code>{row.component}</code>
                              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                            </a>
                          ) : (
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                              {row.component}
                            </code>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground text-xs">{row.variants}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium text-foreground mb-3">Card neutra (shadcn)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Para contenido textual genérico (settings, modales internos, secciones de detalle).
                Composición libre vía <code className="text-xs bg-muted px-1 rounded">className</code>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-card p-6 rounded-card border border-border shadow-sm">
                  <h4 className="text-lg font-medium text-foreground">Default</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    bg-card · border · rounded-card · shadow-sm
                  </p>
                </div>
                <div className="bg-card p-6 rounded-card border border-border hover:bg-muted transition-colors cursor-pointer">
                  <h4 className="text-lg font-medium text-foreground">Hover (clickable)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Añade <code className="text-xs">hover:bg-muted</code>
                  </p>
                </div>
              </div>
            </div>
          }
        />
      </DSComponentSpec>
    </>
  );
}
