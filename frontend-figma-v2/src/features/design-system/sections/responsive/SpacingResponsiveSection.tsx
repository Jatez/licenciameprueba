import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSCrossRefBanner } from "../../components/DSCrossRefBanner";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

export function SpacingResponsiveSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-spacing"
        title="Spacing system"
        status="stable"
        lastUpdate={TODAY}
      />
      <DSCrossRefBanner
        targetId="spacing"
        targetLabel="Foundations / Spacing"
        scope="cómo escalan padding y márgenes por breakpoint"
      />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
        Padding y márgenes que escalan con el viewport. Más compactos en móvil, más aireados en desktop.
      </p>

      <Subsection
        id="responsive-spacing-container"
        title="Padding de contenedor"
        description="Padding horizontal del page wrapper. Se respira más en pantallas grandes."
      >
        <CodeBlock code={`<div className="px-4 md:px-6 lg:px-8">…</div>`} />
        <PreviewBox className="!p-0">
          <div className="px-4 md:px-6 lg:px-8 py-4 bg-primary/10">
            <div className="bg-card border border-border rounded h-12 flex items-center justify-center text-xs text-muted-foreground">
              Contenido — el padding lateral aumenta con el viewport
            </div>
          </div>
        </PreviewBox>
      </Subsection>

      <Subsection
        id="responsive-spacing-section"
        title="Espaciado vertical de sección"
        description="Espaciado entre bloques principales de una página."
      >
        <CodeBlock code={`<section className="py-6 md:py-8 lg:py-12">…</section>`} />
      </Subsection>

      <Subsection
        id="responsive-spacing-card"
        title="Padding interno de card"
        description="Cards y paneles. Más compacto en móvil para aprovechar el espacio."
      >
        <CodeBlock code={`<div className="p-4 md:p-6 rounded-card border border-border bg-card">…</div>`} />
        <PreviewBox className="!p-0 !border-0 !bg-transparent">
          <div className="p-4 md:p-6 rounded-card border border-border bg-card">
            <p className="text-sm text-foreground">Card con padding responsive (p-4 md:p-6).</p>
          </div>
        </PreviewBox>
      </Subsection>

      <Subsection
        id="responsive-spacing-gaps"
        title="Gaps en grids y stacks"
        description="Mantener proporciones legibles. Por defecto gap-4 en móvil y gap-6 en tablet+."
      >
        <CodeBlock code={`<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">…</div>
<div className="flex flex-col md:flex-row gap-3 md:gap-4">…</div>`} />
      </Subsection>
    </>
  );
}
