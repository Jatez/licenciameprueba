import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { DSStatus } from "../DesignSystem.types";
import { DSComponentName } from "./spec/DSComponentName";

interface DSSectionHeaderProps {
  id: string;
  title: string;
  status?: DSStatus;
  lastUpdate?: string;
  /** Nombre canónico (ej. "<Button />"). Si está, renderiza pill copiable. */
  componentName?: string;
}

const STATUS_VARIANT: Record<DSStatus, "vigente" | "info" | "expirada"> = {
  stable: "vigente",
  beta: "info",
  deprecated: "expirada",
};

export function DSSectionHeader({
  id,
  title,
  status = "stable",
  lastUpdate,
  componentName,
}: DSSectionHeaderProps) {
  const { t } = useTranslation("designSystem");
  return (
    <div className="mb-6 pb-3 border-b border-border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id} className="text-2xl font-semibold text-foreground scroll-mt-32">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {componentName && <DSComponentName name={componentName} />}
          <Badge variant={STATUS_VARIANT[status]}>{t(`status.${status}`)}</Badge>
        </div>
      </div>
      {lastUpdate && (
        <p className="text-xs text-muted-foreground mt-1.5">
          {t("page.lastUpdate")}: {lastUpdate}
        </p>
      )}
    </div>
  );
}
