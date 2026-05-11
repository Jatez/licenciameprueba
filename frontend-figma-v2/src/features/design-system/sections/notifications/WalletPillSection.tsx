import { useState } from "react";
import { WalletPill } from "@/shared/components/notifications/WalletPill";
import { Slider } from "@/components/ui/slider";
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
  { name: "Icon", desc: "Emoji contextual según estado (🔒 / 🚨 / ⚠️ / 💳)." },
  { name: "Label", desc: "'{n} créditos · {estado}' o 'Sin créditos'." },
];

const TOKENS = [
  "rounded-pill", "bg-error-subtle", "bg-error-subtle/60",
  "bg-warning-subtle/60", "bg-bodycard-bg", "text-foreground",
];

const A11Y = [
  "El emoji es decorativo (aria-hidden); el texto comunica el estado.",
  "Contraste AA garantizado por tokens del DS.",
];

const DOS = [
  "Mostrar siempre que el usuario ejecute una acción que consuma créditos.",
  "Umbrales: 0 = sin créditos, ≤10% = recarga ya, ≤30% = saldo bajo, >30% = OK.",
];

const DONTS = [
  "Reemplazar el copy 'créditos' por iconos solos — pierde claridad legal.",
  "Tintar con brand lima — el lima es solo CTA.",
];

const SNIPPET = `import { WalletPill } from "@/shared/components/notifications/WalletPill";

<WalletPill available={120} total={500} />`;

export function WalletPillSection() {
  const [available, setAvailable] = useState(120);
  const total = 500;
  return (
    <>
      <DSSectionHeader
        id="wallet-pill"
        title="Wallet Pill — Estado de créditos"
        status="stable"
        lastUpdate={TODAY}
        componentName="<WalletPill />"
      />
      <DSComponentSpec
        description="Pill que comunica la salud del wallet del usuario. Cambia color, copy e icono según el porcentaje de créditos disponibles vs total. Cuatro estados: OK / saldo bajo / recarga ya / sin créditos."
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
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Los 4 estados</h4>
                    <div className="flex flex-wrap gap-3">
                      <WalletPill available={0} total={500} />
                      <WalletPill available={30} total={500} />
                      <WalletPill available={120} total={500} />
                      <WalletPill available={350} total={500} />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-border">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Interactivo · {available} / {total}
                    </h4>
                    <Slider value={[available]} max={total} step={5} onValueChange={([v]) => setAvailable(v)} />
                    <WalletPill available={available} total={total} />
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