import { Inbox, Music, ShoppingBag, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
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

const TODAY = "2026-04-23";

const ANATOMY = [
  { name: "iconContainer", desc: "Círculo h-10 w-10 con bg subtle (metric-subtle o muted) que contiene el icono." },
  { name: "icon", desc: "LucideIcon h-5 w-5, color heredado del contenedor (text-metric o muted-foreground)." },
  { name: "title", desc: "h3 text-sm font-semibold text-foreground — obligatorio." },
  { name: "description", desc: "p text-xs text-muted-foreground, max-w-xs centrada — opcional." },
  { name: "cta", desc: "Button size='sm' variant='outline' — visible solo si hay ctaLabel + (ctaHref ó onCtaClick)." },
];

const A11Y = [
  'El contenedor del icono usa aria-hidden="true" — el icono es decorativo.',
  "El título se renderiza como <h3> para mantener jerarquía dentro del card padre.",
  'Cuando hay ctaHref, el CTA navega vía <Link> de react-router (foco gestionado por el router).',
  "Cuando hay onCtaClick sin href, el CTA es <button> nativo — recibe foco y se activa con Enter/Space.",
  "Texto centrado y descripción acotada (max-w-xs) para evitar líneas excesivamente largas en lectura.",
  "El componente NO declara role='status' — debe envolverse en un contenedor con aria-live si el empty state aparece dinámicamente tras una acción del usuario.",
];

const DOS = [
  "Usar DENTRO de cards, tabs o paneles — no como empty state de página completa.",
  "Mantener el icono semánticamente alineado con el dominio (Music para catálogo, ShoppingBag para compras).",
  "Activar tone='muted' cuando el empty state coexiste con datos en la misma vista (menos protagónico).",
  "Si la acción navega, prefiere ctaHref antes que onCtaClick + navigate manual.",
];

const DONTS = [
  "Usarlo como hero de página vacía — para eso existe el EmptyState de dashboard con ilustración.",
  "Mostrar CTA sin onCtaClick ni ctaHref — el componente lo oculta automáticamente, pero indica intención poco clara.",
  "Apilar dos EmptyStateCard en la misma card — colapsa la jerarquía visual.",
  "Reemplazar el icono por una imagen rasterizada — el contenedor está pensado para LucideIcon vectorial.",
];

const PROPS = [
  { name: "icon", type: "LucideIcon", required: true, desc: "Icono decorativo del estado." },
  { name: "title", type: "string", required: true, desc: "Título corto del estado vacío." },
  { name: "description", type: "string", required: false, desc: "Descripción adicional opcional." },
  { name: "ctaLabel", type: "string", required: false, desc: "Texto del CTA. Sin ctaHref ni onCtaClick no se renderiza." },
  { name: "ctaHref", type: "string", required: false, desc: "Ruta interna (react-router). Tiene prioridad sobre onCtaClick." },
  { name: "onCtaClick", type: "() => void", required: false, desc: "Handler cuando no hay ctaHref." },
  { name: "tone", type: '"subtle" | "muted"', required: false, desc: "Tono del icon container. Default: 'subtle'." },
  { name: "className", type: "string", required: false, desc: "Clases adicionales sobre el contenedor raíz." },
];

const CODE = `import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Music } from "lucide-react";

// Con CTA navegacional
<EmptyStateCard
  icon={Music}
  title="Aún no has licenciado canciones"
  description="Cuando emitas licencias, las canciones más usadas aparecerán aquí"
  ctaLabel="Explorar catálogo"
  ctaHref="/catalog"
/>

// Sin CTA, tono muted
<EmptyStateCard
  icon={Music}
  title="Sin actividad reciente"
  description="Tu actividad aparecerá aquí cuando empieces a operar"
  tone="muted"
/>`;

export function EmptyStateCardSection() {
  return (
    <>
      <DSSectionHeader
        id="empty-state-card"
        title="Empty State Card"
        status="stable"
        lastUpdate={TODAY}
        componentName="<EmptyStateCard />"
      />
      <DSComponentSpec
        description="Empty state compacto para usar dentro de cards, tabs o paneles. Icono + título + descripción + CTA opcional. Para empty states de página completa, usa el EmptyState de dashboard."
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
                  "rounded-card",
                  "px-4 py-8 (padding interno)",
                  "h-10 w-10 rounded-full (icon container)",
                  "bg-metric-subtle/[0.63] text-metric (tone='subtle')",
                  "bg-muted text-muted-foreground (tone='muted')",
                  "text-sm font-semibold (title)",
                  "text-xs text-muted-foreground max-w-xs (description)",
                  "Button size='sm' variant='outline' (CTA)",
                ]}
              />
              <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Props
                </h3>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Prop</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Tipo</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Req.</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROPS.map((p) => (
                        <tr key={p.name} className="border-t border-border">
                          <td className="px-3 py-2"><code className="text-xs text-foreground">{p.name}</code></td>
                          <td className="px-3 py-2"><code className="text-xs text-muted-foreground">{p.type}</code></td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{p.required ? "Sí" : "—"}</td>
                          <td className="px-3 py-2 text-muted-foreground">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Default</p>
                    <EmptyStateCard
                      icon={Inbox}
                      title="Sin actividad reciente"
                      description="Tu actividad aparecerá aquí cuando empieces a operar"
                    />
                  </Card>
                  <Card className="p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Con CTA navegacional</p>
                    <EmptyStateCard
                      icon={Music}
                      title="Aún no has licenciado canciones"
                      description="Cuando emitas licencias, las canciones más usadas aparecerán aquí"
                      ctaLabel="Explorar catálogo"
                      ctaHref="/catalog"
                    />
                  </Card>
                  <Card className="p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tone muted</p>
                    <EmptyStateCard
                      icon={ShoppingBag}
                      title="Sin pagos en este período"
                      description="Compras y alertas de saldo aparecerán aquí"
                      tone="muted"
                    />
                  </Card>
                  <Card className="p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mínimo (sin descripción)</p>
                    <EmptyStateCard
                      icon={Sparkles}
                      title="Sin descripción"
                      ctaLabel="Acción"
                      onCtaClick={() => undefined}
                    />
                  </Card>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "Default",
                    node: (
                      <Card className="p-4">
                        <EmptyStateCard
                          icon={Inbox}
                          title="Sin actividad"
                          description="Tu actividad aparecerá aquí"
                        />
                      </Card>
                    ),
                  },
                  {
                    label: "Con CTA",
                    node: (
                      <Card className="p-4">
                        <EmptyStateCard
                          icon={Music}
                          title="Sin canciones"
                          description="Aún no has licenciado canciones"
                          ctaLabel="Explorar"
                          ctaHref="/catalog"
                        />
                      </Card>
                    ),
                  },
                ]}
              />

              <DSCode snippet={CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
