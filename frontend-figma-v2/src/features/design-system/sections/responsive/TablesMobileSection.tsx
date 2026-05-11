import { DSSectionHeader } from "../../components/DSSectionHeader";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

const ROWS = [
  { id: "TX-2401", date: "12/04/26", concept: "Pack Premium 100", amount: "299€" },
  { id: "TX-2402", date: "10/04/26", concept: "Renovación licencia", amount: "89€" },
  { id: "TX-2403", date: "08/04/26", concept: "Track sync — Cinepolis", amount: "1.200€" },
];

export function TablesMobileSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-tables"
        title="Tables & data on mobile"
        status="stable"
        lastUpdate={TODAY}
      />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
        Regla práctica: <strong>menos de 4 columnas</strong> → scroll horizontal.
        <strong> 4 o más columnas</strong>, o columnas con contenido largo → transformar cada fila en una card apilada en móvil (preferido para datos complejos).
      </p>

      <Subsection
        id="responsive-tables-scroll"
        title="Estrategia 1 — Scroll horizontal"
        description="Para tablas simples (pocas columnas). Usa overflow-x-auto y permite scroll a sangre con -mx-4 px-4."
      >
        <CodeBlock
          code={`<div className="-mx-4 px-4 overflow-x-auto md:mx-0 md:px-0">
  <table className="w-full min-w-[560px] text-sm">
    …
  </table>
</div>`}
        />
        <PreviewBox className="!p-0">
          <div className="-mx-1 px-1 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-semibold">ID</th>
                  <th className="text-left p-3 font-semibold">Fecha</th>
                  <th className="text-left p-3 font-semibold">Concepto</th>
                  <th className="text-right p-3 font-semibold">Importe</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-3 font-medium whitespace-nowrap">{r.id}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{r.date}</td>
                    <td className="p-3">{r.concept}</td>
                    <td className="p-3 text-right font-medium whitespace-nowrap">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PreviewBox>
      </Subsection>

      <Subsection
        id="responsive-tables-cards"
        title="Estrategia 2 — Cards apiladas (preferida con 4+ columnas)"
        description="Render dual: la tabla solo se muestra en md+, en móvil se renderiza una lista de cards con la información estructurada."
      >
        <CodeBlock
          code={`{/* Desktop: tabla */}
<table className="hidden md:table w-full">…</table>

{/* Mobile: cards */}
<ul className="md:hidden space-y-3">
  {rows.map((r) => (
    <li key={r.id} className="rounded-card border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
        <span className="text-base font-semibold">{r.amount}</span>
      </div>
      <p className="text-sm">{r.concept}</p>
      <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
    </li>
  ))}
</ul>`}
        />
        <PreviewBox>
          <ul className="space-y-3">
            {ROWS.map((r) => (
              <li key={r.id} className="rounded-md border border-border bg-background p-4">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                  <span className="text-base font-semibold text-foreground">{r.amount}</span>
                </div>
                <p className="text-sm text-foreground">{r.concept}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
              </li>
            ))}
          </ul>
        </PreviewBox>
      </Subsection>

      <Subsection
        id="responsive-tables-charts"
        title="Charts y gráficos"
        description="Usa siempre ResponsiveContainer de Recharts. En móvil reduce densidad de ticks del eje X (interval, minTickGap) o permite scroll horizontal del contenedor."
      >
        <CodeBlock
          code={`<ResponsiveContainer width="100%" height={240}>
  <LineChart data={data}>
    <XAxis dataKey="date" interval="preserveStartEnd" minTickGap={32} />
    …
  </LineChart>
</ResponsiveContainer>`}
        />
      </Subsection>
    </>
  );
}
