import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/components/notifications/Modal";
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
  { name: "Backdrop", desc: "bg-lm-black/50, cierra al hacer click fuera." },
  { name: "Container", desc: "bg-surface, rounded-xl, shadow-lg, max-w-md." },
  { name: "Title", desc: "h3 text-lg font-semibold text-foreground." },
  { name: "Body", desc: "text-sm text-muted-foreground." },
  { name: "Actions", desc: "Secondary (border) + Primary (bg-lm-black) alineados a la derecha." },
];

const TOKENS = ["bg-lm-black/50", "bg-surface", "rounded-xl", "shadow-lg", "bg-lm-black", "text-white"];

const A11Y = [
  "role='dialog' aria-modal='true' en el contenedor.",
  "Focus trap recomendado al integrar (no incluido en este wrapper minimalista).",
  "Cierre con Esc o click en backdrop.",
];

const DOS = [
  "Usar para confirmar acciones destructivas o irreversibles (anular licencia, borrar cuenta).",
  "Mantener el copy explícito sobre las consecuencias.",
  "CTA primario en negro siempre, incluso para destructivas.",
];

const DONTS = [
  "Usar para feedback informativo — eso es Toast o Banner.",
  "Más de 2 acciones en el footer.",
  "Diálogos anidados.",
];

const SNIPPET = `import { Modal } from "@/shared/components/notifications/Modal";

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="¿Anular licencia?"
  primaryCta={{ label: "Anular", onClick: handleConfirm }}
  secondaryCta={{ label: "Cancelar", onClick: () => setOpen(false) }}
>
  Esta acción no se puede deshacer.
</Modal>`;

export function ModalFeedbackSection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DSSectionHeader
        id="modal-feedback"
        title="Modal — Confirmación destructiva"
        status="stable"
        lastUpdate={TODAY}
        componentName="<Modal />"
      />
      <DSComponentSpec
        description="Diálogo modal centrado para confirmaciones destructivas o decisiones críticas. Backdrop semi-opaco, container blanco con shadow-lg, CTA primario negro."
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
                <div className="space-y-3 rounded-card border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">
                    Click en el botón para abrir el modal real:
                  </p>
                  <Button onClick={() => setOpen(true)}>Abrir modal de confirmación</Button>
                  <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    title="¿Anular licencia LIC-2089?"
                    primaryCta={{ label: "Anular", onClick: () => setOpen(false) }}
                    secondaryCta={{ label: "Cancelar", onClick: () => setOpen(false) }}
                  >
                    Esta acción no se puede deshacer. La licencia dejará de ser válida y no se reembolsarán los créditos consumidos.
                  </Modal>
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