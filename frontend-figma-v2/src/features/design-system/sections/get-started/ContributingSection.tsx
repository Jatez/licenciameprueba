import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-17";
const ITEMS = ["i1", "i2", "i3", "i4", "i5"] as const;

export function ContributingSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="contributing" title={t("sections.contributing.title")} status="stable" lastUpdate={TODAY} />
      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{t("sections.contributing.intro")}</p>
      <ol className="space-y-2 text-sm text-foreground max-w-2xl list-decimal pl-5">
        {ITEMS.map((k) => (
          <li key={k}>{t(`sections.contributing.items.${k}`)}</li>
        ))}
      </ol>
    </>
  );
}
