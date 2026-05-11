import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import {
  DSTokenRow,
  DSTokenTable,
} from "@/components/design-system/primitives/DSTokenRow";

const TODAY = "2026-04-30";

interface ShadowToken {
  name: string;
  tw: string;
  cssVar: string;
  css: string;
  usageKey: string;
}

const SHADOWS: ShadowToken[] = [
  { name: "sm",   tw: "shadow-sm",   cssVar: "--shadow-sm",   css: "0 1px 2px rgba(0,0,0,0.05)",                 usageKey: "sm" },
  { name: "md",   tw: "shadow-md",   cssVar: "--shadow-md",   css: "0 4px 6px -1px rgba(0,0,0,0.1)",             usageKey: "md" },
  { name: "lg",   tw: "shadow-lg",   cssVar: "--shadow-lg",   css: "0 10px 15px -3px rgba(0,0,0,0.1)",           usageKey: "lg" },
  { name: "glow", tw: "shadow-glow", cssVar: "--shadow-glow", css: "0 0 20px hsl(var(--color-primary) / 0.3)",   usageKey: "glow" },
];

export function ShadowsSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="shadows" title={t("sections.shadows.title")} status="stable" lastUpdate={TODAY} />
      <DSTokenTable>
        {SHADOWS.map((s) => (
          <DSTokenRow
            key={s.name}
            name={s.name}
            tailwind={s.tw}
            cssVar={s.cssVar}
            value={s.css}
            preview={
              <div
                className={`h-10 w-16 bg-card rounded-md ${s.tw}`}
                aria-hidden="true"
              />
            }
            usage={t(`sections.shadows.usage.${s.usageKey}`)}
          />
        ))}
      </DSTokenTable>
    </>
  );
}
