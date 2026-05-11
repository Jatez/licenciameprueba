import { useTranslation } from "react-i18next";

const TODAY = "2026-04-17";

export function DSSidebarFooter() {
  const { t } = useTranslation("designSystem");
  return (
    <div className="mt-auto pt-4 border-t border-border px-3 pb-3">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t("page.version")}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {t("page.lastUpdate")}: {TODAY}
      </p>
    </div>
  );
}
