import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-17";
const ROWS = ["onboarding", "criticalError", "success", "legalConfirmation"] as const;

export function VoiceToneSection() {
  const { t } = useTranslation("designSystem");
  const h = t("sections.voiceTone.headers", { returnObjects: true }) as Record<string, string>;

  return (
    <>
      <DSSectionHeader id="voice-tone" title={t("sections.voiceTone.title")} status="beta" lastUpdate={TODAY} />
      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{t("sections.voiceTone.intro")}</p>
      <div className="bg-card rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-semibold text-foreground">{h.context}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.tone}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.good}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.bad}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((k) => (
              <tr key={k} className="border-t border-border align-top">
                <td className="p-3 font-medium text-foreground">{t(`sections.voiceTone.rows.${k}.context`)}</td>
                <td className="p-3 text-muted-foreground">{t(`sections.voiceTone.rows.${k}.tone`)}</td>
                <td className="p-3 text-foreground">✓ {t(`sections.voiceTone.rows.${k}.good`)}</td>
                <td className="p-3 text-muted-foreground">✗ {t(`sections.voiceTone.rows.${k}.bad`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
