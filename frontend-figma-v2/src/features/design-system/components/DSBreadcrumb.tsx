import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { NAV_GROUPS } from "../config/navigation";

interface DSBreadcrumbProps {
  activeId: string;
}

export function DSBreadcrumb({ activeId }: DSBreadcrumbProps) {
  const { t } = useTranslation("designSystem");

  const group = NAV_GROUPS.find((g) => g.sections.some((s) => s.id === activeId));
  const section = group?.sections.find((s) => s.id === activeId);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
        <li className="hidden md:inline-flex shrink-0">{t("breadcrumb.root")}</li>
        {group && (
          <>
            <ChevronRight className="hidden md:inline-block h-3 w-3 shrink-0" aria-hidden="true" />
            <li className="hidden md:inline-flex shrink-0">{t(group.labelKey)}</li>
          </>
        )}
        {section && (
          <>
            <ChevronRight className="hidden md:inline-block h-3 w-3 shrink-0" aria-hidden="true" />
            <li className="text-foreground font-medium truncate">{t(section.labelKey)}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
