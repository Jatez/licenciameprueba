import { XCircle } from "lucide-react";
import { licensingStrings } from "@/modules/packages/licensing/strings";

export function UsageTypeDisabledBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-foreground">
      <XCircle className="h-3 w-3" aria-hidden="true" />
      {licensingStrings.step2.notAvailableForTrack}
    </span>
  );
}
