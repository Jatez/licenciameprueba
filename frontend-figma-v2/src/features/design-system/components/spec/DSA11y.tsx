import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

interface DSA11yProps {
  items: string[];
}

export function DSA11y({ items }: DSA11yProps) {
  const { t } = useTranslation("designSystem");
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("spec.headings.a11y")}
      </h3>
      <ul className="space-y-2 list-none">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 items-start text-sm text-foreground">
            <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
