import { DSSectionHeader } from "../../components/DSSectionHeader";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

const PATTERNS = [
  {
    title: "4 columnas en desktop",
    classes: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6",
    cells: 4,
    desc: "KPI rows, listas de cards densas, métricas de dashboard.",
  },
  {
    title: "3 columnas en desktop",
    classes: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
    cells: 3,
    desc: "Catálogo de tracks, packages, contenido editorial.",
  },
  {
    title: "2 columnas en desktop",
    classes: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6",
    cells: 2,
    desc: "Layout principal + panel lateral, formularios extensos.",
  },
];

function PatternBoxes({ count }: { count: number }) {
  return (
    <PreviewBox>
      <div
        className={
          count === 4
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            : count === 3
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              : "grid grid-cols-1 lg:grid-cols-2 gap-3"
        }
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-primary/15 border border-primary/30 rounded-md flex items-center justify-center text-xs font-medium text-foreground"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    </PreviewBox>
  );
}

export function LayoutPatternsSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-layouts"
        title="Layout patterns"
        status="stable"
        lastUpdate={TODAY}
      />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
        Patrones de grid estándar. Empieza por <code className="bg-muted px-1 rounded text-xs">grid-cols-1</code> y escala.
        Redimensiona la ventana para ver los reflujos.
      </p>

      {PATTERNS.map((p) => (
        <Subsection
          key={p.title}
          id={`responsive-layouts-${p.cells}`}
          title={p.title}
          description={p.desc}
        >
          <CodeBlock code={`<div className="${p.classes}">\n  {/* items */}\n</div>`} />
          <PatternBoxes count={p.cells} />
        </Subsection>
      ))}

      <Subsection
        id="responsive-layouts-stack-row"
        title="Stack vertical → horizontal"
        description="Para grupos pequeños de elementos que se apilan en móvil y se alinean en horizontal en tablet+."
      >
        <CodeBlock code={`<div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">\n  {/* items */}\n</div>`} />
      </Subsection>
    </>
  );
}
