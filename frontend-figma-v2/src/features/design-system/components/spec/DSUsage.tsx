import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

interface DSUsageProps {
  dos: string[];
  donts: string[];
}

export function DSUsage({ dos, donts }: DSUsageProps) {
  const { t } = useTranslation("designSystem");
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("spec.headings.usage")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Check className="h-4 w-4 text-success" />
            <h4 className="text-sm font-semibold text-foreground">{t("spec.headings.do")}</h4>
          </div>
          <ul className="space-y-2 list-none">
            {dos.map((d, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-success flex-shrink-0">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <X className="h-4 w-4 text-error" />
            <h4 className="text-sm font-semibold text-foreground">{t("spec.headings.dont")}</h4>
          </div>
          <ul className="space-y-2 list-none">
            {donts.map((d, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-error flex-shrink-0">✗</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
