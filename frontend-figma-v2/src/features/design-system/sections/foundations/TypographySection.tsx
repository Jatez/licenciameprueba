import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-17";

const ROWS = [
  { token: "Display", tw: "text-4xl font-bold", specimen: "Aa 123", specimenClass: "text-4xl font-bold", usageKey: "display" },
  { token: "Heading 1", tw: "text-2xl font-semibold", specimen: "Aa 123", specimenClass: "text-2xl font-semibold", usageKey: "heading1" },
  { token: "Heading 2", tw: "text-xl font-semibold", specimen: "Aa 123", specimenClass: "text-xl font-semibold", usageKey: "heading2" },
  { token: "Heading 3", tw: "text-lg font-medium", specimen: "Aa 123", specimenClass: "text-lg font-medium", usageKey: "heading3" },
  { token: "Body", tw: "text-base", specimen: "La música que necesitas, legal y sin fricción.", specimenClass: "text-base", usageKey: "body" },
  { token: "Body SM", tw: "text-sm", specimen: "Metadata secundaria y descripciones cortas.", specimenClass: "text-sm", usageKey: "bodySm" },
  { token: "Caption", tw: "text-xs font-medium", specimen: "12 créditos restantes • Hace 2 horas", specimenClass: "text-xs font-medium", usageKey: "caption" },
  { token: "Overline", tw: "text-xs font-semibold uppercase tracking-wider", specimen: "CATEGORÍA • GÉNERO MUSICAL", specimenClass: "text-xs font-semibold uppercase tracking-wider", usageKey: "overline" },
];

export function TypographySection() {
  const { t } = useTranslation("designSystem");
  const h = t("sections.typography.headers", { returnObjects: true }) as Record<string, string>;

  return (
    <>
      <DSSectionHeader id="typography" title={t("sections.typography.title")} status="stable" lastUpdate={TODAY} />
      <div className="bg-card rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-semibold text-foreground">{h.token}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.tailwind}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.specimen}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.usage}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.token} className="border-t border-border">
                <td className="p-3 text-foreground">{r.token}</td>
                <td className="p-3"><code className="text-xs bg-muted px-1 rounded text-foreground">{r.tw}</code></td>
                <td className={`p-3 text-foreground ${r.specimenClass}`}>{r.specimen}</td>
                <td className="p-3 text-muted-foreground text-sm">{t(`sections.typography.usage.${r.usageKey}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Utilities */}
      <h3 className="text-lg font-medium text-foreground mt-8 mb-2">Utilities</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Utilidades tipográficas para casos especializados (cifras, ejes, tablas).
      </p>
      <div className="bg-card rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-semibold text-foreground">Class</th>
              <th className="text-left p-3 font-semibold text-foreground">Demo</th>
              <th className="text-left p-3 font-semibold text-foreground">Uso</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="p-3"><code className="text-xs bg-muted px-1 rounded text-foreground">.font-tnum</code></td>
              <td className="p-3">
                <div className="flex flex-col text-foreground">
                  <span className="font-tnum">1,234.56</span>
                  <span className="font-tnum">9,876.10</span>
                  <span className="font-tnum">  111.00</span>
                </div>
              </td>
              <td className="p-3 text-muted-foreground">
                Cifras tabulares (alineadas en columna). Obligatorio en KPIs, ejes de chart y tablas numéricas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
