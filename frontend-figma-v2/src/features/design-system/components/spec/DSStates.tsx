import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

interface DSStateItem {
  label: string;
  className?: string;
  node: ReactNode;
}

interface DSStatesProps {
  states: DSStateItem[];
}

export function DSStates({ states }: DSStatesProps) {
  const { t } = useTranslation("designSystem");
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("spec.headings.states")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {states.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-md p-4 flex flex-col items-center gap-3"
          >
            <div className="flex-1 flex items-center justify-center min-h-[60px] w-full">
              {s.node}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">{s.label}</p>
              {s.className && (
                <code className="text-[10px] text-muted-foreground">{s.className}</code>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
