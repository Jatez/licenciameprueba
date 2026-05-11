import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSTokens } from "../../components/spec/DSTokens";
import {
  DSTokenRow,
  DSTokenTable,
} from "@/components/design-system/primitives/DSTokenRow";
import { CHART_PALETTE } from "@/design-system/tokens/chartPalette";

const TODAY = "2026-04-30";

/* -------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------- */

function Swatch({ tw, className = "" }: { tw: string; className?: string }) {
  return (
    <div
      className={`h-12 w-12 rounded-md border border-border ${tw} ${className}`}
      aria-hidden="true"
    />
  );
}

function HexSwatch({ hex }: { hex: string }) {
  return (
    <div
      className="h-12 w-12 rounded-md border border-border"
      style={{ background: hex }}
      aria-hidden="true"
    />
  );
}

function SubSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h3
        id={id}
        className="text-lg font-medium text-foreground scroll-mt-32 mb-2"
      >
        {title}
      </h3>
      {description ? (
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}

/* -------------------------------------------------------------
 * Token data
 * ---------------------------------------------------------- */

const CORE_TOKENS = [
  { name: "primary", tw: "bg-primary", cssVar: "--primary", value: "68 81% 65% (#DBEC62)", usage: "CTA principal y acento de marca" },
  { name: "primary-hover", tw: "bg-primary-hover", cssVar: "--primary-hover", value: "#C8D855", usage: "Hover de CTA primario" },
  { name: "lm-black", tw: "bg-lm-black", cssVar: "--lm-black", value: "#050505", usage: "Tinta de marca, texto sobre primary" },
  { name: "bg-1", tw: "bg-bg-1", cssVar: "--bg-1", value: "#E7E7E9", usage: "Fondo alternativo" },
  { name: "bg-2", tw: "bg-bg-2", cssVar: "--bg-2", value: "#F3F4F6", usage: "Fondo base de la app" },
  { name: "surface", tw: "bg-surface", cssVar: "--surface", value: "#FFFFFF", usage: "Superficie elevada (cards)" },
];

const SURFACE_TOKENS = [
  { name: "page-bg", tw: "bg-page-bg", cssVar: "--page-bg", value: "var(--bg-2)", usage: "Fondo de página global" },
  { name: "bodycard-bg", tw: "bg-bodycard-bg", cssVar: "--bodycard-bg", value: "var(--surface)", usage: "Card flotante (BodyCard)" },
  { name: "sidebar-bg", tw: "bg-sidebar-bg", cssVar: "--sidebar-bg", value: "var(--lm-black)", usage: "Margen exterior + AppSidebar" },
  { name: "ink-900", tw: "bg-ink-900", cssVar: "--ink-900", value: "0 0% 7%", usage: "Tinta principal (texto, iconos)" },
  { name: "ink-700", tw: "bg-ink-700", cssVar: "--ink-700", value: "0 0% 24%", usage: "Tinta secundaria" },
];

const SEMANTIC_TOKENS = [
  { name: "background", tw: "bg-background", cssVar: "--background", value: "var(--page-bg)", usage: "Fondo base de la app" },
  { name: "card", tw: "bg-card", cssVar: "--card", value: "var(--surface)", usage: "Cards, modales, popovers" },
  { name: "muted", tw: "bg-muted", cssVar: "--muted", value: "0 0% 96%", usage: "Filas alternas, hover states" },
  { name: "primary", tw: "bg-primary", cssVar: "--primary", value: "68 81% 65%", usage: "CTA primario" },
  { name: "primary-subtle", tw: "bg-primary-subtle", cssVar: "--primary-subtle", value: "68 81% 90%", usage: "Estado activo en navegación" },
  { name: "foreground", tw: "text-foreground", cssVar: "--foreground", value: "var(--ink-900)", usage: "Texto principal" },
  { name: "muted-foreground", tw: "text-muted-foreground", cssVar: "--muted-foreground", value: "var(--ink-700)", usage: "Metadata, captions" },
  { name: "primary-foreground", tw: "text-primary-foreground", cssVar: "--primary-foreground", value: "var(--lm-black)", usage: "Texto sobre bg-primary" },
  { name: "border", tw: "border-border", cssVar: "--border", value: "0 0% 90%", usage: "Bordes, dividers" },
  { name: "input", tw: "border-input", cssVar: "--input", value: "0 0% 90%", usage: "Bordes de inputs" },
  { name: "ring", tw: "ring-ring", cssVar: "--ring", value: "var(--primary)", usage: "Focus ring (accesibilidad)" },
];

const METRIC_TOKENS = [
  { name: "metric-subtle", tw: "bg-metric-subtle", cssVar: "--metric-subtle", value: "68 60% 92%", usage: "Fondo de pill KPI" },
  { name: "metric", tw: "text-metric", cssVar: "--metric", value: "68 40% 30%", usage: "Texto sobre metric-subtle" },
];

const NEUTRALS = [
  { n: "50", h: "#F9FAFB", tw: "bg-gray-50" },
  { n: "100", h: "#F3F4F6", tw: "bg-gray-100" },
  { n: "200", h: "#E5E7EB", tw: "bg-gray-200" },
  { n: "300", h: "#D1D5DB", tw: "bg-gray-300" },
  { n: "400", h: "#9CA3AF", tw: "bg-gray-400" },
  { n: "500", h: "#6B7280", tw: "bg-gray-500" },
  { n: "700", h: "#3D3D3D", tw: "bg-gray-700" },
  { n: "900", h: "#121212", tw: "bg-gray-900" },
];

const FEEDBACK_TOKENS = [
  { name: "success-subtle", tw: "bg-success-subtle", cssVar: "--color-success-subtle", value: "#BAC374", usage: "Fondo de estados de éxito" },
  { name: "warning-subtle", tw: "bg-warning-subtle", cssVar: "--color-warning-subtle", value: "#E0AE74", usage: "Fondo de estados de advertencia" },
  { name: "error-subtle",   tw: "bg-error-subtle",   cssVar: "--color-error-subtle",   value: "#C37474", usage: "Fondo de estados de error" },
  { name: "info-subtle",    tw: "bg-info-subtle",    cssVar: "--color-info-subtle",    value: "#7478C3", usage: "Fondo de estados informativos" },
];

/* -------------------------------------------------------------
 * Chart Palette (anidada como subsección)
 * ---------------------------------------------------------- */

interface SeriesMeta {
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  hex: string;
  hsl: string;
  tw: string;
  cssVar: string;
  usageKey: string;
}

const CHART_SERIES: SeriesMeta[] = [
  { slot: 1, name: "Lime",   hex: "#DDED64", hsl: "66 80% 66%",  tw: "bg-chart-1", cssVar: "--chart-1", usageKey: "single-use" },
  { slot: 2, name: "Cyan",   hex: "#64EDEB", hsl: "179 80% 66%", tw: "bg-chart-2", cssVar: "--chart-2", usageKey: "stories-pack" },
  { slot: 3, name: "Olive",  hex: "#949873", hsl: "66 14% 52%",  tw: "bg-chart-3", cssVar: "--chart-3", usageKey: "monthly-extended" },
  { slot: 4, name: "Coral",  hex: "#ED9564", hsl: "21 80% 66%",  tw: "bg-chart-4", cssVar: "--chart-4", usageKey: "long-video" },
  { slot: 5, name: "Violet", hex: "#B464ED", hsl: "273 80% 66%", tw: "bg-chart-5", cssVar: "--chart-5", usageKey: "paid-post" },
  { slot: 6, name: "Blue",   hex: "#6478ED", hsl: "230 80% 66%", tw: "bg-chart-6", cssVar: "--chart-6", usageKey: "collaborative-post" },
];

function ChartPaletteSubsection() {
  const { t } = useTranslation("designSystem");
  const usage = t("sections.chartPalette.usage", { returnObjects: true }) as Record<string, string>;
  const rules = t("sections.chartPalette.rules", { returnObjects: true }) as string[];

  return (
    <SubSection
      id="chart-palette"
      title={t("sections.chartPalette.title")}
      description={t("sections.chartPalette.description")}
    >
      <DSTokenTable caption={t("sections.chartPalette.mappingTitle")}>
        {CHART_SERIES.map((s) => (
          <DSTokenRow
            key={s.slot}
            name={`chart-${s.slot} · ${s.name}`}
            tailwind={s.tw}
            cssVar={s.cssVar}
            value={`${s.hsl} (${s.hex})`}
            preview={
              <div
                className="h-10 w-10 rounded-full border border-border"
                style={{ background: `hsl(var(${s.cssVar}))` }}
                aria-hidden="true"
              />
            }
            usage={usage[s.usageKey]}
          />
        ))}
      </DSTokenTable>

      {/* Demo en vivo */}
      <div className="rounded-card border border-border bg-foreground p-6 my-6">
        <p className="text-xs uppercase tracking-wider text-background/60 mb-3">
          {t("sections.chartPalette.demoTitle")}
        </p>
        <div className="flex h-24 w-full overflow-hidden rounded-md">
          {CHART_PALETTE.map((c, i) => (
            <div
              key={i}
              className="h-full"
              style={{ background: c, width: `${[22, 18, 15, 17, 14, 14][i]}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CHART_SERIES.map((s) => (
            <span
              key={s.slot}
              className="inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/5 px-2.5 py-1 text-xs text-background"
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: `hsl(var(${s.cssVar}))` }}
              />
              {t("sections.chartPalette.seriesLabel", { slot: s.slot })}
            </span>
          ))}
        </div>
      </div>

      <h4 className="text-sm font-medium text-foreground mb-2">
        {t("sections.chartPalette.rulesTitle")}
      </h4>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-6">
        {rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>

      <DSTokens
        tokens={[
          "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5", "--chart-6",
          "bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5", "bg-chart-6",
          "chartColor(slot)",
        ]}
      />
    </SubSection>
  );
}

/* -------------------------------------------------------------
 * Section
 * ---------------------------------------------------------- */

export function ColorsSection() {
  const { t } = useTranslation("designSystem");

  return (
    <>
      <DSSectionHeader
        id="colors"
        title={t("sections.colors.title")}
        status="stable"
        lastUpdate={TODAY}
      />

      <SubSection
        id="colors-core"
        title={t("sections.colors.core")}
        description="Tokens de marca y superficies base. Origen de toda la paleta."
      >
        <DSTokenTable>
          {CORE_TOKENS.map((row) => (
            <DSTokenRow
              key={row.name}
              name={row.name}
              tailwind={row.tw}
              cssVar={row.cssVar}
              value={row.value}
              preview={<Swatch tw={row.tw} />}
              usage={row.usage}
            />
          ))}
        </DSTokenTable>
      </SubSection>

      <SubSection
        id="colors-surfaces"
        title="Surfaces"
        description="Tokens estructurales del shell. Cambiar la variable repinta toda la app."
      >
        <DSTokenTable>
          {SURFACE_TOKENS.map((row) => (
            <DSTokenRow
              key={row.name}
              name={row.name}
              tailwind={row.tw}
              cssVar={row.cssVar}
              value={row.value}
              preview={<Swatch tw={row.tw} />}
              usage={row.usage}
            />
          ))}
        </DSTokenTable>
      </SubSection>

      <SubSection
        id="colors-semantic"
        title={t("sections.colors.semanticTokens")}
        description="Tokens semánticos reales que la app consume. Cambiar el valor en index.css propaga a todos los componentes."
      >
        <DSTokenTable>
          {SEMANTIC_TOKENS.map((row) => (
            <DSTokenRow
              key={row.name}
              name={row.name}
              tailwind={row.tw}
              cssVar={row.cssVar}
              value={row.value}
              preview={<Swatch tw={row.tw.startsWith("bg-") || row.tw.startsWith("ring-") || row.tw.startsWith("border-") ? row.tw : `bg-${row.name}`} />}
              usage={row.usage}
            />
          ))}
        </DSTokenTable>
      </SubSection>

      <SubSection
        id="colors-metric"
        title="Metric (KPI accent)"
        description={
          <>
            Par de tokens dedicados al acento KPI sobre superficies claras
            (consumidos por <code className="text-xs bg-muted px-1 rounded">{`<Badge variant="metric" />`}</code>).
          </>
        }
      >
        <DSTokenTable>
          {METRIC_TOKENS.map((row) => (
            <DSTokenRow
              key={row.name}
              name={row.name}
              tailwind={row.tw}
              cssVar={row.cssVar}
              value={row.value}
              preview={<Swatch tw={`bg-${row.name}`} />}
              usage={row.usage}
            />
          ))}
        </DSTokenTable>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-metric-subtle text-metric">
            +12.4% MoM
          </span>
        </div>
      </SubSection>

      <SubSection
        id="colors-neutrals"
        title={t("sections.colors.neutrals")}
        description="Escala de grises Tailwind utilizada como referencia. Para uso productivo prefiere los tokens semánticos arriba."
      >
        <DSTokenTable>
          {NEUTRALS.map((c) => (
            <DSTokenRow
              key={c.n}
              name={`gray-${c.n}`}
              tailwind={c.tw}
              cssVar={`--gray-${c.n}`}
              value={c.h}
              preview={<HexSwatch hex={c.h} />}
            />
          ))}
        </DSTokenTable>
      </SubSection>

      <SubSection
        id="colors-feedback"
        title={t("sections.colors.semantic")}
        description={
          <>
            Paleta semántica única: tonos <code className="text-xs bg-muted px-1 rounded">*-subtle</code> (mate)
            usados como fondo junto a <code className="text-xs bg-muted px-1 rounded">text-foreground</code>.
            Las clases <code className="text-xs bg-muted px-1 rounded">text-success/warning/error/info</code> apuntan al mismo tono mate por compatibilidad.
          </>
        }
      >
        <DSTokenTable>
          {FEEDBACK_TOKENS.map((row) => (
            <DSTokenRow
              key={row.name}
              name={row.name}
              tailwind={row.tw}
              cssVar={row.cssVar}
              value={row.value}
              preview={<Swatch tw={row.tw} />}
              usage={row.usage}
            />
          ))}
        </DSTokenTable>
      </SubSection>

      {/* Chart Palette anidada */}
      <ChartPaletteSubsection />

      {/* Alias y notas */}
      <SubSection
        id="colors-aliases"
        title="Alias y notas"
        description="Tokens con valores duplicados o alias en uso. Documentados para evitar confusión durante la consolidación."
      >
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">gray-100</code>{" "}
            = <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">bodycard-bg</code> —
            mismo valor (<span className="font-mono">#F3F4F6</span>), distinto rol semántico. Usa{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">bodycard-bg</code> en superficies de card.
          </li>
          <li>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">ink-900</code>{" "}
            = <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">gray-900</code>{" "}
            (<span className="font-mono">0 0% 7%</span>) — alias en uso, en evaluación para consolidación.
            Prefiere <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">text-foreground</code> en componentes.
          </li>
        </ul>
      </SubSection>
    </>
  );
}
