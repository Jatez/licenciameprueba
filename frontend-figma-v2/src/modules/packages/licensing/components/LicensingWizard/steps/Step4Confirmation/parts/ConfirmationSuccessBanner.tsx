import { CheckCircle2 } from "lucide-react";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";

interface Props {
  licenseTokenId: string;
}

export function ConfirmationSuccessBanner({ licenseTokenId }: Props) {
  const t = licensingStrings.step4;
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 rounded-2xl border border-success/30 bg-success/5 px-6 py-8 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success animate-in zoom-in-95 duration-300">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold leading-tight text-foreground">
        {t.successTitle}
      </h2>
      <p className="text-sm text-muted-foreground">
        {t.licenseIdLabel}:{" "}
        <span className="font-mono font-semibold text-foreground">
          {licenseTokenId}
        </span>
      </p>
      <span className="sr-only">
        {formatString("{title}, {label} {id}", {
          title: t.successTitle,
          label: t.licenseIdLabel,
          id: licenseTokenId,
        })}
      </span>
    </div>
  );
}
