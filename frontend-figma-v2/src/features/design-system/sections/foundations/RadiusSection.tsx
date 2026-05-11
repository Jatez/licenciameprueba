import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import {
  DSTokenRow,
  DSTokenTable,
} from "@/components/design-system/primitives/DSTokenRow";

const TODAY = "2026-04-30";

interface RadiusItem {
  name: string;
  value: string;
  tw: string;
  cssVar: string;
  usageKey?: string;
  fallbackUsage?: string;
  highlight?: boolean;
}

const ITEMS: RadiusItem[] = [
  { name: "sm",   value: "6px",    tw: "rounded-sm",   cssVar: "--radius-sm",   usageKey: "sm" },
  { name: "md",   value: "8px",    tw: "rounded-md",   cssVar: "--radius-md",   usageKey: "md" },
  { name: "lg",   value: "12px",   tw: "rounded-lg",   cssVar: "--radius-lg",   usageKey: "lg" },
  {
    name: "card",
    value: "20px",
    tw: "rounded-card",
    cssVar: "--radius-card",
    fallbackUsage: "Cards de producto (KPI, ImageOverlayCard, BodyCard)",
    highlight: true,
  },
  { name: "pill", value: "9999px", tw: "rounded-pill", cssVar: "--radius-pill", fallbackUsage: "Badges, chips, pills" },
  { name: "full", value: "9999px", tw: "rounded-full", cssVar: "--radius-full", usageKey: "full" },
];

export function RadiusSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="radius" title={t("sections.radius.title")} status="stable" lastUpdate={TODAY} />
      <DSTokenTable>
        {ITEMS.map((it) => (
          <DSTokenRow
            key={it.name}
            name={
              it.highlight
                ? `${it.name} · default`
                : it.name
            }
            tailwind={it.tw}
            cssVar={it.cssVar}
            value={it.value}
            preview={
              <div
                className={`h-12 w-12 bg-muted border border-border ${it.tw}`}
                aria-hidden="true"
              />
            }
            usage={
              it.usageKey ? t(`sections.radius.usage.${it.usageKey}`) : it.fallbackUsage
            }
          />
        ))}
      </DSTokenTable>
    </>
  );
}
