import { useState } from "react";
import { Check } from "lucide-react";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-23";

const ITEMS = [
  "Probado en viewport de 375px (sin scroll horizontal)",
  "Todos los touch targets ≥ 40×40px",
  "Todos los inputs usan text-base (mínimo 16px)",
  "Grids con conteo de columnas mobile-first (grid-cols-1 por defecto)",
  "Tipografía escala con prefijos md: y lg:",
  "Sidebar colapsa a drawer por debajo de lg",
  "Tablas resueltas con scroll horizontal o cards apiladas",
  "Modales full-screen o bottom-sheet por debajo de md",
  "CTAs primarios w-full en móvil",
  "Sin interacciones que dependan únicamente de hover",
];

export function MobileChecklistSection() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const completed = Object.values(checked).filter(Boolean).length;

  const toggle = (i: number) => setChecked((p) => ({ ...p, [i]: !p[i] }));

  return (
    <>
      <DSSectionHeader
        id="responsive-checklist"
        title="Mobile-first build checklist"
        status="stable"
        lastUpdate={TODAY}
      />
      <div className="bg-card border-2 border-primary/40 rounded-card p-4 md:p-6 shadow-md">
        <div className="flex items-baseline justify-between gap-3 mb-4 pb-3 border-b border-border">
          <h3 className="text-lg md:text-xl font-semibold text-foreground">
            Checklist antes de marcar como done
          </h3>
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {completed} / {ITEMS.length}
          </span>
        </div>
        <ul className="space-y-2">
          {ITEMS.map((label, i) => {
            const isChecked = !!checked[i];
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-pressed={isChecked}
                >
                  <span
                    className={`h-5 w-5 shrink-0 rounded border-2 inline-flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-primary border-primary"
                        : "border-border bg-background"
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 text-lm-black" strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-sm md:text-base ${
                      isChecked ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
          Última actualización: {TODAY} · Referencia completa en{" "}
          <code className="bg-muted px-1 rounded">src/design-system/RESPONSIVE_GUIDELINES.md</code>
        </p>
      </div>
    </>
  );
}
