import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-17";

export function IntroSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="intro" title={t("sections.intro.title")} status="stable" lastUpdate={TODAY} />
      <div className="space-y-3 text-sm text-foreground max-w-2xl">
        <p>{t("sections.intro.p1")}</p>
        <p>{t("sections.intro.p2")}</p>
        <p>{t("sections.intro.p3")}</p>
      </div>
    </>
  );
}
