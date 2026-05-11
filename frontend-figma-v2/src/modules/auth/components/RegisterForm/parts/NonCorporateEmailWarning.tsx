import { AlertTriangle } from "lucide-react";
import { authStrings } from "../../../strings";

export function NonCorporateEmailWarning() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-1 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{authStrings.register.warnings.nonCorporateEmail}</span>
    </div>
  );
}
