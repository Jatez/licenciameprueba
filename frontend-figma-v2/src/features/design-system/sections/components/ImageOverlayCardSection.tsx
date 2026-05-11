import { ArrowUpRight } from "lucide-react";
import { ImageOverlayCard } from "@/shared/components/ds/ImageOverlayCard";
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

const IMG_LANDSCAPE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=400&fit=crop";
const IMG_SQUARE =
  "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=420&h=420&fit=crop";

const ANATOMY = [
  { name: "container", desc: "Wrapper interactivo (button/a/div) con rounded-card y border-border. Define el aspect-ratio." },
  { name: "image", desc: "Background-image (bg-cover bg-center) sobre bg-lm-gray-700 como fallback." },
  { name: "overlay", desc: "Capa visual: gradient-bottom · gradient-full · blur-panel." },
  { name: "content", desc: "Bloque de título + descripción posicionado (bottom · center · top)." },
  { name: "cta", desc: "Slot opcional para acción (icono o botón) junto al título." },
];

const A11Y = [
  "Por defecto se renderiza como <button>; pasa as='a' + href para enlaces o as='div' para tarjetas decorativas.",
  "El aria-label cae automáticamente sobre el title cuando el elemento es interactivo. Override vía prop si la acción difiere.",
  "La imagen es decorativa por defecto (aria-hidden). Si aporta info, pasa imageAlt y se convertirá en role='img'.",
  "Texto blanco sobre overlay gradient: contraste verificado AA con intensity 'default' o superior.",
  "Texto ink-900 sobre blur-panel: card-blur-content garantiza la legibilidad (white 60% + blur 100px).",
  "focus-visible:ring-2 ring-ring siempre activo en variantes interactivas.",
];

const DOS = [
  "Usa overlayStyle='gradient-bottom' para tiles de catálogo (presets, géneros).",
  "Usa overlayStyle='blur-panel' para tarjetas con jerarquía editorial (categorías, moods).",
  "Usa overlayStyle='gradient-full' cuando el copy sea largo y necesite contraste uniforme.",
  "Mantén descripciones cortas (1-2 líneas máximo).",
  "Combina con un width fijo dentro de un horizontal scroller usando wrapper externo.",
];

const DONTS = [
  "No anides botones dentro: el wrapper YA es interactivo (clickable area completa).",
  "No uses imágenes con bordes claros sobre gradient-bottom subtle (pierde contraste).",
  "No mezcles aspect-ratios distintos en un mismo carrusel.",
  "No reimplementes esta receta inline — extiende vía props.",
];

const CODE = `import { ImageOverlayCard } from "@/shared/components/ds/ImageOverlayCard";
import { ArrowUpRight } from "lucide-react";

// Catálogo (ThemedCard preset)
<ImageOverlayCard
  image={preset.image}
  title={preset.title}
  description={preset.description}
  aspectRatio="8/5"
  overlayStyle="gradient-bottom"
  overlayIntensity="default"
  hoverEffect="scale"
  onClick={() => onApply(preset.filters)}
/>

// Categoría editorial (CategoryCard preset)
<ImageOverlayCard
  image={category.image}
  title={category.title}
  description={category.description}
  aspectRatio="1/1"
  overlayStyle="blur-panel"
  cta={<ArrowUpRight size={20} className="text-lm-gray-700" />}
/>`;

function VariantTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

export function ImageOverlayCardSection() {
  return (
    <>
      <DSSectionHeader
        id="image-overlay-card"
        title="ImageOverlayCard"
        status="stable"
        lastUpdate={TODAY}
        componentName="<ImageOverlayCard />"
      />
      <DSComponentSpec
        description="Primitiva única para 'image card with overlay'. Un solo componente para tiles de catálogo, categorías editoriales y moods. Reemplaza tres implementaciones duplicadas (ThemedCard, CategoryCard, MoodCard) que ahora son adaptadores finos sobre esta primitiva."
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
                  "rounded-card (18px · sustituye al magic 1.13rem)",
                  "border-border · bg-surface · bg-lm-gray-700 (image fallback)",
                  "gradient-bottom: bg-gradient-to-t from-[hsl(var(--ink-900)/0.85)]",
                  "gradient-full: bg-[hsl(var(--ink-900)/0.45)]",
                  "blur-panel: card-blur-content (white 60% + backdrop-blur 100px)",
                  "hover scale: scale-[1.04] · 300ms ease-in-out",
                  "focus-visible: ring-2 ring-ring",
                  "Text on dark overlay: text-white · text-white/85 (description)",
                  "Text on blur panel: text-ink-900 · text-lm-gray-700 (description)",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <VariantTile label="overlayStyle = gradient-bottom · 8/5 (preset ThemedCard)">
                    <ImageOverlayCard
                      image={IMG_LANDSCAPE}
                      title="Pop latino"
                      description="120 BPM · upbeat · bilingüe"
                      aspectRatio="8/5"
                      overlayStyle="gradient-bottom"
                      onClick={() => {}}
                    />
                  </VariantTile>

                  <VariantTile label="overlayStyle = blur-panel · 1/1 (preset CategoryCard)">
                    <div className="w-[260px]">
                      <ImageOverlayCard
                        image={IMG_SQUARE}
                        title="Reggaetón"
                        description="42 tracks"
                        aspectRatio="1/1"
                        overlayStyle="blur-panel"
                        cta={<ArrowUpRight size={20} className="text-lm-gray-700" />}
                      />
                    </div>
                  </VariantTile>

                  <VariantTile label="overlayStyle = blur-panel · 8/5 (preset MoodCard)">
                    <ImageOverlayCard
                      image={IMG_LANDSCAPE}
                      title="Energía cardio"
                      description="Sesiones de alta intensidad"
                      aspectRatio="8/5"
                      overlayStyle="blur-panel"
                      cta={<ArrowUpRight size={20} className="text-lm-gray-700" />}
                    />
                  </VariantTile>

                  <VariantTile label="overlayStyle = gradient-full · 16/9 · contentPosition center">
                    <ImageOverlayCard
                      image={IMG_LANDSCAPE}
                      title="Editorial destacado"
                      description="Selección de la semana"
                      aspectRatio="16/9"
                      overlayStyle="gradient-full"
                      overlayIntensity="default"
                      contentPosition="center"
                      onClick={() => {}}
                    />
                  </VariantTile>

                  <VariantTile label="overlayStyle = gradient-bottom · intensity strong · 4/3">
                    <ImageOverlayCard
                      image={IMG_SQUARE}
                      title="Cinemático"
                      description="Para edits con narrativa"
                      aspectRatio="4/3"
                      overlayStyle="gradient-bottom"
                      overlayIntensity="strong"
                      onClick={() => {}}
                    />
                  </VariantTile>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "default",
                    node: (
                      <div className="w-56">
                        <ImageOverlayCard
                          image={IMG_LANDSCAPE}
                          title="Default"
                          description="Reposo"
                          aspectRatio="8/5"
                          overlayStyle="gradient-bottom"
                        />
                      </div>
                    ),
                  },
                  {
                    label: "hover (sim.)",
                    node: (
                      <div className="w-56 [&_[role=img]]:scale-[1.04]">
                        <ImageOverlayCard
                          image={IMG_LANDSCAPE}
                          title="Hover"
                          description="scale 1.04"
                          aspectRatio="8/5"
                          overlayStyle="gradient-bottom"
                          imageAlt="hover"
                        />
                      </div>
                    ),
                  },
                  {
                    label: "focus visible",
                    node: (
                      <div className="w-56 [&>*]:ring-2 [&>*]:ring-ring">
                        <ImageOverlayCard
                          image={IMG_LANDSCAPE}
                          title="Focus"
                          description="ring-2 ring-ring"
                          aspectRatio="8/5"
                          overlayStyle="gradient-bottom"
                        />
                      </div>
                    ),
                  },
                  {
                    label: "loading (skeleton)",
                    node: (
                      <div
                        className="w-56 rounded-card border border-border bg-muted relative overflow-hidden"
                        style={{ aspectRatio: "8/5" }}
                      >
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-lm-gray-200 to-muted" />
                        <div className="absolute bottom-3 left-3 right-3 space-y-2">
                          <div className="h-3 w-2/3 rounded bg-lm-gray-300" />
                          <div className="h-2 w-1/2 rounded bg-lm-gray-300" />
                        </div>
                      </div>
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
