import { DSSectionHeader } from "../../components/DSSectionHeader";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

const BREAKPOINTS = [
  { name: "default", min: 0, max: 639, prefix: "—", device: "Móvil pequeño / base" },
  { name: "sm", min: 640, max: 767, prefix: "sm:", device: "Móvil grande" },
  { name: "md", min: 768, max: 1023, prefix: "md:", device: "Tablet" },
  { name: "lg", min: 1024, max: 1279, prefix: "lg:", device: "Desktop pequeño" },
  { name: "xl", min: 1280, max: 1535, prefix: "xl:", device: "Desktop" },
  { name: "2xl", min: 1536, max: 1920, prefix: "2xl:", device: "Desktop grande" },
];

const MAX_PX = 1600;

export function BreakpointsSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-breakpoints"
        title="Breakpoints"
        status="stable"
        lastUpdate={TODAY}
      />
      <Subsection
        id="responsive-breakpoints-rules"
        title="Mobile-first siempre"
        description="Los estilos sin prefijo aplican en móvil. Cada prefijo activa estilos a partir de su ancho mínimo. Nunca uses media queries decrecientes."
      >
        <CodeBlock
          code={`// ✅ Correcto — mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" />

// ❌ Evitar — tamaño desktop como base
<div className="grid grid-cols-4 sm:grid-cols-1" />`}
        />
      </Subsection>

      <Subsection
        id="responsive-breakpoints-table"
        title="Los 6 breakpoints del sistema"
        description="Rangos en píxeles CSS y prefijo Tailwind correspondiente."
      >
        <div className="bg-card rounded-card border border-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-semibold">Breakpoint</th>
                <th className="text-left p-3 font-semibold">Prefijo</th>
                <th className="text-left p-3 font-semibold">Rango</th>
                <th className="text-left p-3 font-semibold hidden md:table-cell">Dispositivo</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp) => (
                <tr key={bp.name} className="border-t border-border">
                  <td className="p-3 font-medium">{bp.name}</td>
                  <td className="p-3"><code className="text-xs bg-muted px-1 rounded">{bp.prefix}</code></td>
                  <td className="p-3 text-muted-foreground">
                    {bp.min}px{bp.max < 1920 ? ` – ${bp.max}px` : "+"}
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{bp.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PreviewBox>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Visualización de rangos
          </p>
          <div className="space-y-2">
            {BREAKPOINTS.map((bp) => {
              const start = (bp.min / MAX_PX) * 100;
              const end = (Math.min(bp.max, MAX_PX) / MAX_PX) * 100;
              const width = end - start;
              return (
                <div key={bp.name} className="flex items-center gap-3">
                  <div className="w-16 text-xs font-medium text-foreground">{bp.name}</div>
                  <div className="flex-1 h-6 bg-muted rounded relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-primary rounded"
                      style={{ left: `${start}%`, width: `${width}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="w-24 text-xs text-muted-foreground text-right">
                    {bp.min}–{bp.max < 1920 ? bp.max : "∞"}
                  </div>
                </div>
              );
            })}
          </div>
        </PreviewBox>
      </Subsection>
    </>
  );
}
