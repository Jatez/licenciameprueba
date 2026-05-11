import { X } from "lucide-react";
import { useNotifToastStore } from "@/features/internal-notifications/toastStore";
import { toneIcon, toneIconColor, toneSurface } from "./types";

export function ToastViewport() {
  const toasts = useNotifToastStore((s) => s.toasts);
  const dismiss = useNotifToastStore((s) => s.dismiss);
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-3rem)]">
      {toasts.map((t) => {
        const Icon = toneIcon[t.type];
        return (
          <div
            key={t.id}
            role="alert"
            className={`rounded-md shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in ${toneSurface(t.type, "outlined")}`}
          >
            <Icon aria-hidden="true" className={`shrink-0 h-5 w-5 ${toneIconColor[t.type]}`} />
            <p className="flex-1 min-w-0 text-sm font-medium line-clamp-2 sm:line-clamp-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar notificación"
              className="p-1 rounded text-lm-black/60 hover:text-lm-black shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
