import { Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { TopItemRow } from "@/shared/components/ds/TopItemRow";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSStates,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

const TOP_ITEM_ROW_ANATOMY = [
  { name: "position", desc: "Numeral 1-based opcional, render con tabular numerals." },
  { name: "cover", desc: "Imagen 48×48 con fallback a icono de Lucide cuando no hay src." },
  { name: "title", desc: "Texto principal de 14/medium, truncado a 1 línea." },
  { name: "subtitle", desc: "Línea secundaria 12/muted, truncada a 1 línea." },
  { name: "rightBadges", desc: "Chips auxiliares (platform badges, etc.) — ocultos en <sm." },
  { name: "primaryMetric", desc: "Pill destacado con la métrica activa." },
  { name: "secondaryMetric", desc: "Línea 11px font-tnum con métricas auxiliares." },
];

const TOP_ITEM_ROW_A11Y = [
  'role="button" + tabIndex=0 cuando recibe onClick; sin role en variantes inertes.',
  "Enter y Space activan el row cuando es interactivo.",
  "Focus visible con ring-2 ring-primary; aria-label personalizable por adapter.",
  "Imagen de cover acepta alt vacío cuando es decorativa (cover ya descrito en title).",
  "Las métricas usan font-tnum para alineación numérica perfecta.",
];

const TOP_ITEM_ROW_DOS = [
  "Crear adapters delgados (TopTrackRow, TopArtistRow…) sobre la primitiva.",
  "Usar fallbackIcon contextual (Music para tracks, User para artistas).",
  "Mantener la métrica primaria como Badge variant=\"metric\" para consistencia visual.",
  "Pasar position cuando la lista representa un ranking ordenado.",
];

const TOP_ITEM_ROW_DONTS = [
  "Meter lógica de dominio en la primitiva — todo lo específico va en el adapter.",
  "Usar para items NO ranqueables (eso es ActivityItem).",
  "Sustituir el primaryMetric por texto plano (rompe la jerarquía visual).",
  "Apilar más de 2 líneas en title/subtitle (la fila debe mantenerse de altura constante).",
];

const TOP_ITEM_ROW_CODE = `import { TopItemRow } from "@/shared/components/ds/TopItemRow";
import { Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/platform-badge";

// Domain adapter — keeps the primitive pure
export function TopTrackRow({ track, position, sort }) {
  return (
    <TopItemRow
      position={position}
      cover={{ src: track.coverUrl, fallbackIcon: Music }}
      title={track.title}
      subtitle={track.artist}
      rightBadges={track.platforms.map((p) => (
        <PlatformBadge key={p} platform={p} size="sm" />
      ))}
      primaryMetric={
        <Badge variant="metric" className="px-2.5 py-1 text-[11px] font-semibold font-tnum">
          {primaryByMode[sort]}
        </Badge>
      }
      secondaryMetric={secondaryByMode[sort]}
      onClick={() => navigate(\`/catalog/track/\${track.id}\`)}
      ariaLabel={\`#\${position} \${track.title} — \${track.artist}\`}
    />
  );
}`;

function MockListWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ul className="rounded-card border border-border bg-card divide-y divide-border">
      {children}
    </ul>
  );
}

const SAMPLE_BADGE = (
  <Badge variant="metric" className="px-2.5 py-1 text-[11px] font-semibold font-tnum">
    12 licencias
  </Badge>
);

export function TopItemRowSection() {
  return (
    <>
      <DSSectionHeader
        id="top-item-row"
        title="Top Item Row"
        status="stable"
        lastUpdate={TODAY}
        componentName="<TopItemRow />"
      />
      <DSComponentSpec
        description="Fila horizontal genérica para listas ordenadas (top tracks, top artists, top campañas). Pura presentación: el adapter de dominio mapea sus datos a la API agnóstica de la primitiva."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={TOP_ITEM_ROW_ANATOMY} />
              <DSUsage dos={TOP_ITEM_ROW_DOS} donts={TOP_ITEM_ROW_DONTS} />
              <DSCollapsibleA11y items={TOP_ITEM_ROW_A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "rounded-lg",
                  "px-2 py-2.5",
                  "gap-3",
                  "h-12 w-12 rounded-md (cover)",
                  "bg-muted-foreground/15 (cover bg)",
                  "text-sm font-medium (title)",
                  "text-xs text-muted-foreground (subtitle)",
                  "font-tnum (position + métricas)",
                  "hover:bg-accent",
                  "focus-visible:ring-2 ring-primary",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Completo · cover + badges + métricas
                    </p>
                    <MockListWrapper>
                      <TopItemRow
                        position={1}
                        cover={{ fallbackIcon: Music }}
                        title="Sunset Boulevard"
                        subtitle="Cosmic Riders"
                        rightBadges={
                          <>
                            <PlatformBadge platform="instagram" size="sm" />
                            <PlatformBadge platform="tiktok" size="sm" />
                          </>
                        }
                        primaryMetric={SAMPLE_BADGE}
                        secondaryMetric="24.5K imp · 36 cr"
                        onClick={() => {}}
                      />
                      <TopItemRow
                        position={2}
                        cover={{ fallbackIcon: Music }}
                        title="Neon Tide"
                        subtitle="Soft Future"
                        rightBadges={<PlatformBadge platform="instagram" size="sm" />}
                        primaryMetric={
                          <Badge variant="metric" className="px-2.5 py-1 text-[11px] font-semibold font-tnum">
                            8 licencias
                          </Badge>
                        }
                        secondaryMetric="18.1K imp · 24 cr"
                        onClick={() => {}}
                      />
                    </MockListWrapper>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sin position · sin badges
                    </p>
                    <MockListWrapper>
                      <TopItemRow
                        cover={{ fallbackIcon: Music }}
                        title="Drifting Lights"
                        subtitle="Echo Park"
                        primaryMetric={SAMPLE_BADGE}
                        onClick={() => {}}
                      />
                    </MockListWrapper>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sin cover · solo title
                    </p>
                    <MockListWrapper>
                      <TopItemRow
                        position={1}
                        title="Categoría · Reels e historias"
                        primaryMetric={
                          <Badge variant="metric" className="px-2.5 py-1 text-[11px] font-semibold font-tnum">
                            34%
                          </Badge>
                        }
                        onClick={() => {}}
                      />
                    </MockListWrapper>
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "Default",
                    node: (
                      <ul className="w-full">
                        <TopItemRow
                          position={1}
                          cover={{ fallbackIcon: Music }}
                          title="Sunset Boulevard"
                          subtitle="Cosmic Riders"
                          primaryMetric={SAMPLE_BADGE}
                        />
                      </ul>
                    ),
                  },
                  {
                    label: "Interactive",
                    node: (
                      <ul className="w-full">
                        <TopItemRow
                          position={1}
                          cover={{ fallbackIcon: Music }}
                          title="Sunset Boulevard"
                          subtitle="Cosmic Riders"
                          primaryMetric={SAMPLE_BADGE}
                          onClick={() => {}}
                        />
                      </ul>
                    ),
                  },
                  {
                    label: "No cover",
                    node: (
                      <ul className="w-full">
                        <TopItemRow
                          position={2}
                          title="Categoría"
                          subtitle="Sin cover"
                          primaryMetric={SAMPLE_BADGE}
                        />
                      </ul>
                    ),
                  },
                ]}
              />

              <DSCode snippet={TOP_ITEM_ROW_CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
