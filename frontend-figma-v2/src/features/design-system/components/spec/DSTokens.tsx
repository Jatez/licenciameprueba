import { useTranslation } from "react-i18next";

interface DSTokensProps {
  tokens: string[];
}

export function DSTokens({ tokens }: DSTokensProps) {
  const { t } = useTranslation("designSystem");
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("spec.headings.tokens")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tokens.map((tok) => (
          <code
            key={tok}
            className="text-xs bg-muted text-foreground px-2.5 py-1 rounded border border-border"
          >
            {tok}
          </code>
        ))}
      </div>
    </section>
  );
}
