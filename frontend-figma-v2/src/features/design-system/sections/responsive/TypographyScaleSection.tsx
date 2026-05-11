import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSCrossRefBanner } from "../../components/DSCrossRefBanner";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

const ROWS = [
  { role: "H1 — Página", mobile: "24px", tablet: "30px", desktop: "36px", classes: "text-2xl md:text-3xl lg:text-4xl" },
  { role: "H2 — Sección", mobile: "20px", tablet: "24px", desktop: "24px", classes: "text-xl md:text-2xl" },
  { role: "H3 — Card", mobile: "18px", tablet: "20px", desktop: "20px", classes: "text-lg md:text-xl" },
  { role: "Body", mobile: "14px", tablet: "16px", desktop: "16px", classes: "text-sm md:text-base" },
  { role: "Caption / label", mobile: "12px", tablet: "14px", desktop: "14px", classes: "text-xs md:text-sm" },
  { role: "Inputs", mobile: "16px", tablet: "16px", desktop: "16px", classes: "text-base (siempre)" },
];

export function TypographyScaleSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-typography"
        title="Typography scale"
        status="stable"
        lastUpdate={TODAY}
      />
      <DSCrossRefBanner
        targetId="typography"
        targetLabel="Foundations / Typography"
        scope="cómo escalan los tamaños por breakpoint"
      />
      <Subsection
        id="responsive-typography-table"
        title="Escala de tipografía responsive"
        description="Los tamaños se mantienen legibles en móvil sin sobredimensionar el contenido. Los inputs SIEMPRE usan text-base para evitar el zoom automático de iOS."
      >
        <div className="bg-card rounded-card border border-border overflow-x-auto mb-4">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-semibold">Rol</th>
                <th className="text-left p-3 font-semibold">Móvil</th>
                <th className="text-left p-3 font-semibold">Tablet</th>
                <th className="text-left p-3 font-semibold">Desktop</th>
                <th className="text-left p-3 font-semibold">Clases Tailwind</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.role} className="border-t border-border">
                  <td className="p-3 font-medium">{r.role}</td>
                  <td className="p-3 text-muted-foreground">{r.mobile}</td>
                  <td className="p-3 text-muted-foreground">{r.tablet}</td>
                  <td className="p-3 text-muted-foreground">{r.desktop}</td>
                  <td className="p-3"><code className="text-xs bg-muted px-1 rounded">{r.classes}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Subsection>

      <Subsection
        id="responsive-typography-samples"
        title="Muestras en vivo"
        description="Redimensiona la ventana para ver el escalado."
      >
        <PreviewBox>
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
              Title H1 — Pagina principal
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              H2 — Section heading
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              H3 — Card title
            </h3>
            <p className="text-sm md:text-base text-foreground">
              Body — texto de párrafo estándar usado en descripciones, notas y contenido principal.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Caption — metadatos, ayuda, labels secundarios.
            </p>
          </div>
        </PreviewBox>
        <CodeBlock
          code={`<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">…</h1>
<h2 className="text-xl md:text-2xl font-semibold">…</h2>
<h3 className="text-lg md:text-xl font-semibold">…</h3>
<p  className="text-sm md:text-base">…</p>
<p  className="text-xs md:text-sm text-muted-foreground">…</p>
<input className="text-base" />`}
        />
      </Subsection>
    </>
  );
}
