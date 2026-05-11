import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

interface DSVariantsProps {
  children: ReactNode;
}

export function DSVariants({ children }: DSVariantsProps) {
  const { t } = useTranslation("designSystem");
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("spec.headings.variants")}
      </h3>
      <div>{children}</div>
    </section>
  );
}
