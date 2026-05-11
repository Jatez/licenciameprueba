import { useState } from "react";
import { BolsaPill } from "@/shared/components/notifications/BolsaPill";
import { Input } from "@/components/ui/input";
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

const TODAY = "2026-05-04";

const ANATOMY = [
  { name: "Pill", desc: "rounded-pill, px-3 py-1.5, text-sm font-medium." },
  { name: "Label", desc: "'Vence en {n} días', 'Vence hoy' o 'Bolsa vencida' (line-through)." },
];

const TOKENS = [
  "rounded-pill", "bg-error-subtle", "bg-error-subtle/50",
  "bg-warning-subtle/60", "bg-info-subtle/40", "bg-bodycard-bg",
  "text-foreground", "line-through",
];

const A11Y = [
  "El estado se comunica por texto, no solo por color.",
  "El strike-through en 'Bolsa vencida' refuerza visualmente el estado terminal.",
];

const DOS = [
  "Mostrar en el wallet, en checkout y en el detalle de paquete.",
  "Umbrales: ≤0 vencida · 1 hoy · ≤7 críticos · ≤15 warning · ≤30 info · >30 OK.",
];

const DONTS = [
  "Mostrar la pill cuando no hay paquete activo.",
  "Combinar con WalletPill en la misma pill — son métricas distintas.",
];

const SNIPPET = `import { BolsaPill } from "@/shared/components/notifications/BolsaPill";

<BolsaPill daysLeft={12} />`;

export function BolsaPillSection() {
  const [days, setDays] = useState(10);
  return (
    <>
      <DSSectionHeader
        id="bolsa-pill"
        title="Bolsa Pill — Vigencia de paquete"
        status="stable"
        lastUpdate={TODAY}
        componentName="<BolsaPill />"
      />
      <DSComponentSpec
        description="Pill que comunica los días restantes de un paquete (bolsa). Cambia de color según urgencia. Estado terminal con line-through."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens tokens={TOKENS} />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-5 rounded-card border border-border bg-card p-5">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Los 6 estados</h4>
                    <div className="flex flex-wrap gap-3">
                      <BolsaPill daysLeft={0} />
                      <BolsaPill daysLeft={1} />
                      <BolsaPill daysLeft={5} />
                      <BolsaPill daysLeft={12} />
                      <BolsaPill daysLeft={25} />
                      <BolsaPill daysLeft={60} />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-border">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interactivo</h4>
                    <Input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value || "0", 10))}
                      className="w-32"
                    />
                    <BolsaPill daysLeft={days} />
                  </div>
                </div>
              </DSVariants>
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}