import { useTranslation } from "react-i18next";
import {
  Music, Search, Home, Settings, BarChart3, FolderOpen, Zap, CreditCard, Star,
  Play, Pause, SkipForward, Heart, Share2, Download, Check, X, AlertTriangle, Info, ChevronRight,
  type LucideIcon,
} from "lucide-react";
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
import {
  DSTokenRow,
  DSTokenTable,
} from "@/components/design-system/primitives/DSTokenRow";

const TODAY = "2026-04-17";

const ICONS: { Icon: LucideIcon; name: string }[] = [
  { Icon: Music, name: "Music" }, { Icon: Search, name: "Search" }, { Icon: Home, name: "Home" },
  { Icon: Settings, name: "Settings" }, { Icon: BarChart3, name: "BarChart3" }, { Icon: FolderOpen, name: "FolderOpen" },
  { Icon: Zap, name: "Zap" }, { Icon: CreditCard, name: "CreditCard" }, { Icon: Star, name: "Star" },
  { Icon: Play, name: "Play" }, { Icon: Pause, name: "Pause" }, { Icon: SkipForward, name: "SkipForward" },
  { Icon: Heart, name: "Heart" }, { Icon: Share2, name: "Share2" }, { Icon: Download, name: "Download" },
  { Icon: Check, name: "Check" }, { Icon: X, name: "X" }, { Icon: AlertTriangle, name: "AlertTriangle" },
  { Icon: Info, name: "Info" }, { Icon: ChevronRight, name: "ChevronRight" },
];

const SIZES = [
  { name: "h-4", twPair: "h-4 w-4", px: "16px", iconClass: "h-4 w-4", usage: "Caption, inline en texto pequeño, badges densos." },
  { name: "h-5", twPair: "h-5 w-5", px: "20px", iconClass: "h-5 w-5", usage: "Tamaño por defecto en UI (botones, inputs, list rows)." },
  { name: "h-6", twPair: "h-6 w-6", px: "24px", iconClass: "h-6 w-6", usage: "Section headers, headers de cards." },
  { name: "h-8", twPair: "h-8 w-8", px: "32px", iconClass: "h-8 w-8", usage: "Feature icons, hero modules, empty states." },
];

const ANATOMY = [
  { name: "viewBox", desc: "24×24 (estándar Lucide). No usar otro grid mezclado en la misma vista." },
  { name: "size", desc: "Definir vía clases h-* w-* del set canónico (4, 5, 6, 8)." },
  { name: "strokeWidth", desc: "1.5 por defecto. 2 sólo para CTAs o necesidad explícita de alto contraste." },
  { name: "color", desc: "Hereda con currentColor — controlar con text-* del padre, no con fill/stroke inline." },
  { name: "label semántico", desc: "aria-hidden cuando es decorativo; aria-label cuando es funcional (icon-only buttons)." },
];

const A11Y = [
  'Iconos decorativos (junto a texto): aria-hidden="true" en el SVG o en el contenedor.',
  "Iconos funcionales (botones-icono sin texto visible): aria-label obligatorio describiendo la acción.",
  "Nunca uses sólo color para comunicar significado (ej. error rojo) — combina con icono y texto.",
  "Touch target mínimo de 44×44px para iconos clickables: usa padding del padre, no agrandes el SVG.",
  "Dirección de iconos chevron/arrow: respeta dirección del idioma (RTL) si aplica.",
];

const DOS = [
  "Mantener strokeWidth=1.5 en toda la app salvo CTAs explícitos.",
  "Usar siempre uno de los 4 tamaños canónicos (h-4, h-5, h-6, h-8).",
  "Heredar color con text-* del contenedor, no con fill ni stroke inline.",
  "Marcar aria-hidden cuando el icono acompaña a texto que ya describe la acción.",
];

const DONTS = [
  "Mezclar Lucide con otra librería (Heroicons, Material) en la misma vista.",
  "Usar tamaños arbitrarios como h-[18px] o w-7 — rompe el ritmo visual.",
  "Aplicar fill='currentColor' inline — Lucide es stroke-based.",
  "Omitir aria-label en botones que sólo contienen un icono.",
];

const CODE = `import { Music, Search } from "lucide-react";

// Decorativo (junto a texto)
<button className="inline-flex items-center gap-2">
  <Music className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
  <span>Catálogo</span>
</button>

// Funcional (icon-only)
<button
  type="button"
  aria-label="Buscar"
  className="h-11 w-11 inline-flex items-center justify-center"
>
  <Search className="h-5 w-5" strokeWidth={1.5} />
</button>`;

export function IconsSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader
        id="icons"
        title={t("sections.icons.title")}
        status="stable"
        lastUpdate={TODAY}
        componentName="lucide-react"
      />
      <DSComponentSpec
        description={t("sections.icons.note")}
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
                  "viewBox 24×24",
                  "strokeWidth 1.5 (default) / 2 (high-contrast)",
                  "h-4 w-4 → 16px",
                  "h-5 w-5 → 20px (default UI)",
                  "h-6 w-6 → 24px",
                  "h-8 w-8 → 32px",
                  "currentColor (hereda de text-*)",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tamaños canónicos
                </p>
                <DSTokenTable>
                  {SIZES.map((s) => (
                    <DSTokenRow
                      key={s.name}
                      name={s.name}
                      tailwind={s.twPair}
                      value={s.px}
                      preview={
                        <Music
                          className={`${s.iconClass} text-foreground`}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      }
                      usage={s.usage}
                    />
                  ))}
                </DSTokenTable>

                <div className="mt-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Comparación lado a lado
                  </p>
                  <div className="flex items-end gap-6 rounded-lg border border-border bg-card p-6">
                    {SIZES.map((s) => (
                        <div key={s.name} className="flex flex-col items-center gap-2">
                          <Music
                            className={`${s.iconClass} text-foreground`}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="text-[11px] font-mono text-muted-foreground">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground">{s.px}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Set en uso
                  </p>
                  <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-4">
                    {ICONS.map(({ Icon, name }) => (
                      <div
                        key={name}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-xs text-muted-foreground">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "strokeWidth 1.5 (default)",
                    node: <Music className="h-8 w-8 text-foreground" strokeWidth={1.5} aria-hidden="true" />,
                  },
                  {
                    label: "strokeWidth 2 (high-contrast / CTA)",
                    node: <Music className="h-8 w-8 text-foreground" strokeWidth={2} aria-hidden="true" />,
                  },
                  {
                    label: "Hereda color (text-primary-foreground sobre bg-primary)",
                    node: (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Music className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
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
