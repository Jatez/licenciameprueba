import { useState } from "react";
import { Bell } from "lucide-react";
import type { SowNotif } from "../sections";
import { useNotifToastStore } from "../toastStore";

const toneBadge = {
  success: "bg-success-subtle/40 text-foreground border-success-subtle",
  warning: "bg-warning-subtle/40 text-foreground border-warning-subtle",
  error:   "bg-error-subtle/40 text-foreground border-error-subtle",
  info:    "bg-info-subtle/40 text-foreground border-info-subtle",
} as const;

export function NotifCard({ n }: { n: SowNotif }) {
  const [open, setOpen] = useState(false);
  const show = useNotifToastStore((s) => s.show);

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-bodycard-bg"
        aria-expanded={open}
      >
        <span className="text-xs font-mono text-muted-foreground w-6">#{n.num}</span>
        <span className="flex-1 font-semibold text-foreground">{n.name}</span>
        <span className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded border ${toneBadge[n.tone]}`}>
          {n.tone}
        </span>
        <div className="flex gap-1">
          {n.surfaces.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-pill bg-bodycard-bg text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
        <span className="text-muted-foreground text-sm">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Copy</p>
            <p className="text-foreground">{n.copy}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Disparador</p>
            <p className="text-foreground">{n.trigger}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">CTAs</p>
            <p className="text-foreground">
              <strong>{n.ctaPrimary}</strong>{n.ctaSecondary ? ` · ${n.ctaSecondary}` : ""}
            </p>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => show({ type: n.tone, message: n.copy })}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-lm-black text-white hover:bg-lm-black/90 inline-flex items-center gap-1.5"
            >
              <Bell className="h-3.5 w-3.5" />
              Probar in-app
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
