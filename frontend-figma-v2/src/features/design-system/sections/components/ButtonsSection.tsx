import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSStates,
  DSUsage,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
} from "../../components/spec";

const TODAY = "2026-04-17";
const VARIANTS = ["default", "secondary", "ghost", "danger", "glass"] as const;

export function ButtonsSection() {
  const { t } = useTranslation("designSystem");
  const anatomy = t("spec.buttons.anatomy", { returnObjects: true }) as Array<{ name: string; desc: string }>;
  const a11y = t("spec.buttons.a11y", { returnObjects: true }) as string[];
  const dos = t("spec.buttons.do", { returnObjects: true }) as string[];
  const donts = t("spec.buttons.dont", { returnObjects: true }) as string[];

  return (
    <>
      <DSSectionHeader
        id="buttons"
        title={t("sections.buttons.title")}
        status="stable"
        lastUpdate={TODAY}
        componentName="<Button />"
      />
      <DSComponentSpec description={t("spec.buttons.description")} layout="split">
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={anatomy} />
              <DSUsage dos={dos} donts={donts} />
              <DSCollapsibleA11y items={a11y} />
              <DSCollapsibleTokens
                tokens={[
                  "bg-primary",
                  "text-primary-foreground",
                  "rounded-full",
                  "btn-glow",
                  "ring-primary",
                  "h-10",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                {VARIANTS.map((variant) => (
                  <div
                    key={variant}
                    className={`mb-6 ${variant === "glass" ? "bg-lm-black p-6 rounded-card" : ""}`}
                  >
                    <h4
                      className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                        variant === "glass" ? "text-lm-gray-400" : "text-muted-foreground"
                      }`}
                    >
                      {variant}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant={variant} size="sm">{t("sections.buttons.sizes.sm")}</Button>
                      <Button variant={variant} size="default">{t("sections.buttons.sizes.md")}</Button>
                      <Button variant={variant} size="lg">{t("sections.buttons.sizes.lg")}</Button>
                      <Button variant={variant} size="default" disabled>
                        {t("sections.buttons.sizes.disabled")}
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                  <strong className="text-foreground">{t("sections.buttons.glow")}</strong>{" "}
                  {t("sections.buttons.glowText")}
                </div>
              </DSVariants>

              <DSStates
                states={[
                  { label: t("spec.buttons.states.default"), node: <Button>Default</Button> },
                  {
                    label: t("spec.buttons.states.hover"),
                    className: ":hover",
                    node: <Button className="bg-primary/90">Hover</Button>,
                  },
                  {
                    label: t("spec.buttons.states.focus"),
                    className: ":focus",
                    node: <Button className="ring-2 ring-primary ring-offset-2">Focus</Button>,
                  },
                  {
                    label: t("spec.buttons.states.active"),
                    className: ":active",
                    node: <Button className="scale-[0.98]">Active</Button>,
                  },
                  {
                    label: t("spec.buttons.states.disabled"),
                    className: "[disabled]",
                    node: <Button disabled>Disabled</Button>,
                  },
                ]}
              />

              <DSCode snippet={t("spec.buttons.code")} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
