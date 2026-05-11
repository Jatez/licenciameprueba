import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-17";
const KEYS = [
  "legalClarity",
  "operationalEfficiency",
  "auditableTrust",
  "accessibilityByDefault",
  "modernityWithoutFriction",
] as const;

export function PrinciplesSection() {
  const { t } = useTranslation("designSystem");
  return (
    <>
      <DSSectionHeader id="principles" title={t("sections.principles.title")} status="stable" lastUpdate={TODAY} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        {KEYS.map((k) => (
          <div key={k} className="bg-card p-4 rounded-card border border-border">
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t(`sections.principles.items.${k}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {t(`sections.principles.items.${k}.description`)}
            </p>
            <p className="text-xs text-foreground italic">
              {t(`sections.principles.items.${k}.example`)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
