import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function FormsSection() {
  const { t } = useTranslation("designSystem");
  const anatomy = t("spec.forms.anatomy", { returnObjects: true }) as Array<{ name: string; desc: string }>;
  const a11y = t("spec.forms.a11y", { returnObjects: true }) as string[];
  const dos = t("spec.forms.do", { returnObjects: true }) as string[];
  const donts = t("spec.forms.dont", { returnObjects: true }) as string[];

  return (
    <>
      <DSSectionHeader
        id="forms"
        title={t("sections.forms.title")}
        status="stable"
        lastUpdate={TODAY}
        componentName="<Input /> · <Label /> · <Textarea /> · <Select /> · <Checkbox />"
      />
      <DSComponentSpec description={t("spec.forms.description")} layout="split">
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={anatomy} />
              <DSUsage dos={dos} donts={donts} />
              <DSCollapsibleA11y items={a11y} />
              <DSCollapsibleTokens
                tokens={[
                  "bg-bg-2",
                  "border-lm-gray-300",
                  "ring-primary/30",
                  "border-error",
                  "text-error",
                  "aria-invalid",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="ds-input-default" className="text-sm font-medium text-foreground">
                      {t("sections.forms.states.default")}
                    </Label>
                    <Input
                      id="ds-input-default"
                      className="mt-1.5 bg-bg-2 border-lm-gray-300"
                      placeholder={t("sections.forms.placeholders.default")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ds-input-focused" className="text-sm font-medium text-foreground">
                      {t("sections.forms.states.focused")}
                    </Label>
                    <Input
                      id="ds-input-focused"
                      className="mt-1.5 bg-bg-2 border-primary ring-2 ring-primary/30"
                      placeholder={t("sections.forms.placeholders.focused")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ds-input-error" className="text-sm font-medium text-foreground">
                      {t("sections.forms.states.error")}
                    </Label>
                    <Input
                      id="ds-input-error"
                      className="mt-1.5 bg-bg-2 border-error"
                      defaultValue={t("sections.forms.placeholders.errorValue")}
                      aria-invalid="true"
                      aria-describedby="ds-input-error-msg"
                    />
                    <p id="ds-input-error-msg" className="text-xs text-error mt-1">
                      {t("sections.forms.errorMessage")}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ds-input-disabled" className="text-sm font-medium text-foreground">
                      {t("sections.forms.states.disabled")}
                    </Label>
                    <Input
                      id="ds-input-disabled"
                      className="mt-1.5 bg-lm-gray-50 text-muted-foreground"
                      placeholder={t("sections.forms.placeholders.disabled")}
                      disabled
                    />
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  { label: t("spec.forms.states.default"), node: <Input className="bg-bg-2 border-lm-gray-300" placeholder="—" /> },
                  { label: t("spec.forms.states.focused"), node: <Input className="bg-bg-2 border-primary ring-2 ring-primary/30" placeholder="—" /> },
                  { label: t("spec.forms.states.filled"), node: <Input className="bg-bg-2 border-lm-gray-300" defaultValue="Texto" /> },
                  { label: t("spec.forms.states.error"), node: <Input className="bg-bg-2 border-error" defaultValue="!" aria-invalid="true" /> },
                  { label: t("spec.forms.states.disabled"), node: <Input className="bg-lm-gray-50" disabled placeholder="—" /> },
                ]}
              />

              <DSCode snippet={t("spec.forms.code")} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
