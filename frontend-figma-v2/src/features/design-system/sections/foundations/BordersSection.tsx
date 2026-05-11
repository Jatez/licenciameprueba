import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import {
  DSTokenRow,
  DSTokenTable,
} from "@/components/design-system/primitives/DSTokenRow";

const TODAY = "2026-04-30";

interface BorderToken {
  name: string;
  tw: string;
  cssVar: string;
  value: string;
  preview: JSX.Element;
  usage: string;
}

const BORDERS: BorderToken[] = [
  {
    name: "border-default",
    tw: "border border-border",
    cssVar: "--border",
    value: "1px solid hsl(var(--color-gray-200))",
    preview: <div className="h-px w-20 bg-border" aria-hidden="true" />,
    usage: "Borde estándar de cards, inputs y contenedores",
  },
  {
    name: "border-muted",
    tw: "border border-muted",
    cssVar: "--muted",
    value: "1px solid hsl(var(--color-gray-100))",
    preview: <div className="h-px w-20 bg-muted" aria-hidden="true" />,
    usage: "Borde sutil para separar bloques dentro de superficies claras",
  },
  {
    name: "divider",
    tw: "border-t border-border",
    cssVar: "--border",
    value: "1px solid hsl(var(--color-gray-200))",
    preview: <div className="h-px w-20 bg-border" aria-hidden="true" />,
    usage: "Separador horizontal entre filas o secciones",
  },
  {
    name: "accent",
    tw: "border-t-2 border-primary",
    cssVar: "--primary",
    value: "2px solid hsl(var(--color-primary))",
    preview: <div className="h-0.5 w-20 bg-primary" aria-hidden="true" />,
    usage: "Acento de marca: subrayado de tabs activos, indicador de selección",
  },
  {
    name: "border-input",
    tw: "border border-input",
    cssVar: "--input",
    value: "1px solid hsl(var(--color-gray-300))",
    preview: <div className="h-px w-20 bg-input" aria-hidden="true" />,
    usage: "Borde específico de inputs (ligeramente más oscuro que border-border)",
  },
];

export function BordersSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="borders" title={t("sections.borders.title")} status="stable" lastUpdate={TODAY} />
      <DSTokenTable>
        {BORDERS.map((b) => (
          <DSTokenRow
            key={b.name}
            name={b.name}
            tailwind={b.tw}
            cssVar={b.cssVar}
            value={b.value}
            preview={b.preview}
            usage={b.usage}
          />
        ))}
      </DSTokenTable>
    </>
  );
}
