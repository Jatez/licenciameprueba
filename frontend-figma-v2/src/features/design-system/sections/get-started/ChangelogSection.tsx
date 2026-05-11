import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-23";
const ENTRY_KEYS = ["v120", "v110", "v100"] as const;

export function ChangelogSection() {
  const { t } = useTranslation("designSystem");
  const headers = t("sections.changelog.headers", { returnObjects: true }) as Record<string, string>;

  return (
    <>
      <DSSectionHeader id="changelog" title={t("sections.changelog.title")} status="stable" lastUpdate={TODAY} />
      <div className="bg-card rounded-card border border-border overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-semibold text-foreground">{headers.version}</th>
              <th className="text-left p-3 font-semibold text-foreground">{headers.date}</th>
              <th className="text-left p-3 font-semibold text-foreground">{headers.type}</th>
              <th className="text-left p-3 font-semibold text-foreground">{headers.change}</th>
            </tr>
          </thead>
          <tbody>
            {ENTRY_KEYS.map((key) => {
              const entry = t(`sections.changelog.entries.${key}`, { returnObjects: true }) as Record<string, string>;
              return (
                <tr key={key} className="border-t border-border">
                  <td className="p-3 font-medium text-foreground">{entry.version}</td>
                  <td className="p-3 text-muted-foreground">{entry.date}</td>
                  <td className="p-3 text-muted-foreground">{entry.type}</td>
                  <td className="p-3 text-foreground">{entry.change}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
