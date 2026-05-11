import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { socialStrings } from "@/modules/social/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";
import { cn } from "@/lib/utils";

interface HealthIndicatorProps {
  lastSyncAt: string | null;
  variant?: "ok" | "error";
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function HealthIndicator({ lastSyncAt, variant = "ok" }: HealthIndicatorProps) {
  const copy = socialStrings.health;
  const relative = formatRelativeFromNow(lastSyncAt);
  const hasSync = lastSyncAt && relative !== "—";

  const text = hasSync
    ? variant === "ok"
      ? interpolate(copy.healthy, { n: relative })
      : interpolate(copy.error, { n: relative })
    : copy.unknown;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-help"
            tabIndex={0}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                variant === "ok" ? "bg-success" : "bg-destructive",
              )}
            />
            <span>{text}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {copy.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
