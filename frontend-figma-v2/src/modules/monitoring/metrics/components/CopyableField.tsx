/**
 * F-11 · Copyable evidence field. Click-to-copy with ephemeral toast confirmation.
 * Used in the publication detail page for legal-grade traceability.
 */
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { metricsStrings } from "../strings";
import { interpolateString } from "../utils";

interface CopyableFieldProps {
  label: string;
  value: string;
  /** Optional rendered value override (the underlying copy uses `value`). */
  display?: React.ReactNode;
  /** Compact = no label above; used inside dense lists. */
  compact?: boolean;
}

export function CopyableField({ label, value, display, compact = false }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(metricsStrings.publicationDetail.copied);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("No pudimos copiar al portapapeles.");
    }
  };

  return (
    <div className={cn("group flex items-start justify-between gap-3", compact ? "py-1" : "py-1.5")}>
      <div className="min-w-0 flex-1">
        {!compact && (
          <p className="text-[11px] uppercase tracking-wide text-foreground/50">{label}</p>
        )}
        <div className="mt-0.5 break-all font-tnum text-xs text-foreground">
          {display ?? value}
        </div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={interpolateString(metricsStrings.publicationDetail.copyAria, { label })}
        className={cn(
          "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-foreground/40 transition-opacity",
          "opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-foreground/5 hover:text-foreground",
          copied && "opacity-100 text-emerald-600 dark:text-emerald-400",
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
