import { CheckCircle2 } from "lucide-react";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";

interface Props {
  licenseTokenId: string;
}

export function ConfirmationSuccessBanner({ licenseTokenId }: Props) {
  const t = licensingStrings.step4;
  return (
    <section
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-[28px] border border-success/20 bg-[linear-gradient(145deg,rgba(217,249,157,0.2),rgba(255,255,255,0.96)_56%,rgba(248,250,252,0.98))] px-5 py-6 shadow-[0_22px_54px_rgba(15,23,42,0.08)] sm:px-6 sm:py-7"
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(217,249,157,0.42),transparent_58%)]" />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-white/70 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-success/90 uppercase">
            Confirmación completada
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success animate-in zoom-in-95 duration-300 shadow-inner shadow-white/60">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-2 text-left">
              <h2 className="text-[1.65rem] font-semibold leading-tight text-foreground sm:text-[1.72rem]">
                {t.successTitle}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                La licencia quedó activa y ya puedes descargar el certificado o continuar con la configuración de publicación y monitoreo.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/84 px-4 py-3.5 backdrop-blur-sm">
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {t.licenseIdLabel}
          </p>
          <p className="mt-2 font-mono text-xl font-semibold tracking-[0.08em] text-foreground sm:text-2xl">
            {licenseTokenId}
          </p>
        </div>
      </div>
      <span className="sr-only">
        {formatString("{title}, {label} {id}", {
          title: t.successTitle,
          label: t.licenseIdLabel,
          id: licenseTokenId,
        })}
      </span>
    </section>
  );
}
