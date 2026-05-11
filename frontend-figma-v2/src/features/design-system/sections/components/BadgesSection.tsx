import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSUsage,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
} from "../../components/spec";

const TODAY = "2026-04-17";

export function BadgesSection() {
  const { t } = useTranslation("designSystem");
  const anatomy = t("spec.badges.anatomy", { returnObjects: true }) as Array<{ name: string; desc: string }>;
  const a11y = t("spec.badges.a11y", { returnObjects: true }) as string[];
  const dos = t("spec.badges.do", { returnObjects: true }) as string[];
  const donts = t("spec.badges.dont", { returnObjects: true }) as string[];

  return (
    <>
      <DSSectionHeader
        id="badges"
        title={t("sections.badges.title")}
        status="stable"
        lastUpdate={TODAY}
        componentName="<Badge />"
      />
      <DSComponentSpec description={t("spec.badges.description")} layout="split">
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={anatomy} />
              <DSUsage dos={dos} donts={donts} />
              <DSCollapsibleA11y items={a11y} />
              <DSCollapsibleTokens
                tokens={[
                  "rounded-full",
                  "text-xs",
                  "bg-success-subtle",
                  "bg-error-subtle",
                  "bg-warning-subtle",
                  "bg-metric-subtle",
                  "text-metric",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="vigente">{t("sections.badges.vigente")}</Badge>
                    <Badge variant="consumida">{t("sections.badges.consumida")}</Badge>
                    <Badge variant="expirada">{t("sections.badges.expirada")}</Badge>
                    <Badge variant="pendiente">{t("sections.badges.pendiente")}</Badge>
                    <Badge variant="info">{t("sections.badges.info")}</Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Metric — adaptable a género/categoría
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Una sola variante visual (<code className="text-[10px] bg-muted px-1 rounded">variant=&quot;metric&quot;</code>),
                      el contenido cambia según el dominio: género musical, categoría, métrica numérica, etc.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="metric">{t("sections.badges.reggaeton")}</Badge>
                      <Badge variant="metric">{t("sections.badges.popLatino")}</Badge>
                      <Badge variant="metric">{t("sections.badges.metric")}</Badge>
                    </div>
                  </div>
                </div>
              </DSVariants>
              <DSCode snippet={t("spec.badges.code")} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
