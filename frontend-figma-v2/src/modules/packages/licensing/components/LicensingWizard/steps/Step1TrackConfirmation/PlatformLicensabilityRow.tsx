import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformLicensability } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  platforms: PlatformLicensability[];
}

const LABEL: Record<PlatformLicensability["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export function PlatformLicensabilityRow({ platforms }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {licensingStrings.step1.licensableOn}
      </span>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <span
            key={p.platform}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
              p.allowed
                ? "border-success/25 bg-success/8 text-success/90"
                : "border-border bg-muted/50 text-muted-foreground opacity-60",
            )}
          >
            {p.allowed ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : (
              <X className="h-3 w-3" aria-hidden="true" />
            )}
            {LABEL[p.platform]}
          </span>
        ))}
      </div>
    </div>
  );
}
