import { Button } from "@/components/ui/button";
import { ToastViewport } from "@/shared/components/notifications/Toast";
import { useNotifToastStore, type NotifToastType } from "@/features/internal-notifications/toastStore";
import { toneSurface, toneIcon, toneIconColor } from "@/shared/components/notifications/types";
import { X } from "lucide-react";
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
  { name: "Icon", desc: "Lucide del tono (CheckCircle2 / Info / AlertTriangle / AlertCircle)." },
  { name: "Message", desc: "1 línea en desktop (truncate), 2 líneas máx en mobile (line-clamp-2)." },
  { name: "Close (×)", desc: "Botón con aria-label='Cerrar notificación', text-lm-black/60." },
  { name: "Surface", desc: "outlined (default): bg-surface + border-{tone}-subtle. Sin franja lateral." },
];

const TOKENS = [
  "bg-surface", "border border-success-subtle", "border border-info-subtle",
  "border border-warning-subtle", "border border-error-subtle",
  "text-success", "text-info", "text-warning", "text-error",
  "rounded-md", "shadow-lg", "animate-fade-in",
];

const A11Y = [
  "Contenedor con role='alert' para que lectores de pantalla anuncien el toast.",
  "Auto-dismiss tras 4s; el botón × permite cerrar manualmente.",
  "Iconos decorativos con aria-hidden='true'; el texto comunica el estado.",
  "Contraste AA garantizado por tokens del DS.",
];

const DOS = [
  "Usar para feedback efímero post-acción (guardado, error de red, copiado).",
  "Mantener el copy en una sola línea cuando sea posible.",
  "Disparar con useNotifToastStore.show({ type, message }).",
];

const DONTS = [
  "Usar para mensajes críticos que requieran acción del usuario — usa Banner o Modal.",
  "Apilar más de 3 toasts simultáneos.",
  "Tintar el toast con brand lima (#DBEC62) — el lima es solo CTA, nunca estado.",
];

const SNIPPET = `import { useNotifToastStore } from "@/features/internal-notifications/toastStore";
import { ToastViewport } from "@/shared/components/notifications/Toast";

// Una sola vez en el árbol (App o layout):
<ToastViewport />

// Disparar:
const show = useNotifToastStore((s) => s.show);
show({ type: "success", message: "Licencia emitida correctamente" });`;

const TONES: NotifToastType[] = ["success", "info", "warning", "error"];
const SAMPLE: Record<NotifToastType, string> = {
  success: "Licencia emitida correctamente",
  info: "Tu sesión expira en 5 minutos",
  warning: "Tu saldo está bajo (12 créditos)",
  error: "No se pudo procesar el pago",
};

function ToastPreview({ tone }: { tone: NotifToastType }) {
  const Icon = toneIcon[tone];
  return (
    <div className={`rounded-md shadow-sm px-4 py-3 flex items-center gap-3 ${toneSurface(tone, "outlined")}`}>
      <Icon aria-hidden="true" className={`shrink-0 h-5 w-5 ${toneIconColor[tone]}`} />
      <p className="flex-1 min-w-0 text-sm font-medium truncate">{SAMPLE[tone]}</p>
      <button aria-label="Cerrar" className="p-1 rounded text-lm-black/60 hover:text-lm-black shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastSection() {
  const show = useNotifToastStore((s) => s.show);
  return (
    <>
      <DSSectionHeader
        id="toast"
        title="Toast — Notificación efímera"
        status="stable"
        lastUpdate={TODAY}
        componentName="<ToastViewport /> · useNotifToastStore"
      />
      <DSComponentSpec
        description="Notificación temporal (auto-dismiss 4s) que aparece bottom-right. Layout horizontal: icono · mensaje · ×. Variante outlined por defecto: borde fino del tono sobre bg-surface, sin franja lateral. Cero HEX, 100% tokens semánticos del DS."
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
                  {TONES.map((tone) => (
                    <div key={tone} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <code className="text-xs text-muted-foreground">tone="{tone}"</code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => show({ type: tone, message: SAMPLE[tone] })}
                        >
                          Disparar toast real
                        </Button>
                      </div>
                      <ToastPreview tone={tone} />
                    </div>
                  ))}
                </div>
              </DSVariants>
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
      <ToastViewport />
    </>
  );
}