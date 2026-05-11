import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import brandIsotipo from "@/assets/brand-isotipo.svg";
import brandLogotipo from "@/assets/brand-logotipo.svg";

const TODAY = "2026-04-17";
const INVERT: React.CSSProperties = { filter: "invert(1)" };

export function BrandSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="brand" title={t("sections.brand.title")} status="stable" lastUpdate={TODAY} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-card border border-border flex flex-col items-center justify-center min-h-[120px]">
          <img src={brandIsotipo} alt={t("sections.brand.isotypeLight")} className="h-12 w-auto" />
          <span className="text-xs text-muted-foreground mt-3">{t("sections.brand.isotypeLight")}</span>
        </div>
        <div className="bg-lm-black p-6 rounded-card flex flex-col items-center justify-center min-h-[120px]">
          <img src={brandIsotipo} alt={t("sections.brand.isotypeDark")} className="h-12 w-auto" style={INVERT} />
          <span className="text-xs text-lm-gray-400 mt-3">{t("sections.brand.isotypeDark")}</span>
        </div>
        <div className="bg-card p-6 rounded-card border border-border flex flex-col items-center justify-center min-h-[120px]">
          <img src={brandLogotipo} alt={t("sections.brand.logotypeLight")} className="h-8 w-auto" />
          <span className="text-xs text-muted-foreground mt-3">{t("sections.brand.logotypeLight")}</span>
        </div>
        <div className="bg-lm-black p-6 rounded-card flex flex-col items-center justify-center min-h-[120px]">
          <img src={brandLogotipo} alt={t("sections.brand.logotypeDark")} className="h-8 w-auto" style={INVERT} />
          <span className="text-xs text-lm-gray-400 mt-3">{t("sections.brand.logotypeDark")}</span>
        </div>
      </div>
      <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <strong className="text-foreground">{t("sections.brand.rules")}</strong> {t("sections.brand.rulesText")}
      </div>
    </>
  );
}
