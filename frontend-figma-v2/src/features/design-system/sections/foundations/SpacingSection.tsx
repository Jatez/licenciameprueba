import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import {
  DSTokenRow,
  DSTokenTable,
} from "@/components/design-system/primitives/DSTokenRow";

const TODAY = "2026-04-30";

interface SpacingToken {
  name: string;
  value: string;
  px: number;
  tw: string;
  usage: string;
}

const SPACING_TOKENS: SpacingToken[] = [
  { name: "space-0", value: "0px",  px: 0,  tw: "p-0",  usage: "Sin espacio (reset)" },
  { name: "space-1", value: "4px",  px: 4,  tw: "p-1",  usage: "Gap mínimo entre íconos" },
  { name: "space-2", value: "8px",  px: 8,  tw: "p-2",  usage: "Padding interno de chips y badges" },
  { name: "space-3", value: "12px", px: 12, tw: "p-3",  usage: "Gap denso en listas" },
  { name: "space-4", value: "16px", px: 16, tw: "p-4",  usage: "Padding base de cards y forms" },
  { name: "space-6", value: "24px", px: 24, tw: "p-6",  usage: "Padding de cards principales y secciones" },
  { name: "space-8", value: "32px", px: 32, tw: "p-8",  usage: "Separación entre bloques" },
  { name: "space-10", value: "40px", px: 40, tw: "p-10", usage: "Padding de página en desktop" },
  { name: "space-12", value: "48px", px: 48, tw: "p-12", usage: "Separación entre secciones grandes" },
  { name: "space-16", value: "64px", px: 64, tw: "p-16", usage: "Hero / espaciado generoso" },
  { name: "space-24", value: "96px", px: 96, tw: "p-24", usage: "Espaciado de marketing / landing" },
];

export function SpacingSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="spacing" title={t("sections.spacing.title")} status="stable" lastUpdate={TODAY} />
      <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded-lg">{t("sections.spacing.note")}</p>
      <DSTokenTable>
        {SPACING_TOKENS.map((s) => (
          <DSTokenRow
            key={s.name}
            name={s.name}
            tailwind={s.tw}
            cssVar={`--${s.name}`}
            value={s.value}
            preview={
              <div
                className="bg-primary/30 rounded-sm"
                style={{ width: `${s.px}px`, height: "24px", minWidth: s.px === 0 ? "1px" : undefined }}
                aria-hidden="true"
              />
            }
            usage={s.usage}
          />
        ))}
      </DSTokenTable>
    </>
  );
}
