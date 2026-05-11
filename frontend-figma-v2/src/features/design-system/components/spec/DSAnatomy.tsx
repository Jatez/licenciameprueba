import { useTranslation } from "react-i18next";

interface DSAnatomyProps {
  parts: Array<{ name: string; desc: string }>;
}

export function DSAnatomy({ parts }: DSAnatomyProps) {
  const { t } = useTranslation("designSystem");
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("spec.headings.anatomy")}
      </h3>
      <ol className="space-y-2 list-none">
        {parts.map((p, i) => (
          <li key={p.name} className="flex gap-3 items-start text-sm">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <code className="text-xs font-semibold text-foreground">{p.name}</code>
              <span className="text-muted-foreground ml-2">— {p.desc}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
