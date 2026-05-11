import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CollapsibleSectionProps } from "./CollapsibleSection.types";

/**
 * Generic collapsible block used inside DS sections to hide dense data
 * (tokens, a11y checklists, full source code, edge cases) by default.
 *
 * - Built on Radix Collapsible — keyboard + aria handled natively.
 * - Chevron rotates 90° when expanded.
 * - Visual style consumes only existing DS tokens.
 */
export function CollapsibleSection({
  title,
  defaultOpen = false,
  icon: Icon,
  badge,
  children,
  id,
  density = "comfortable",
}: CollapsibleSectionProps) {
  const reactId = useId();
  const panelId = id ?? `collapsible-${reactId}`;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-md border border-border bg-card/40"
    >
      <CollapsibleTrigger
        id={`${panelId}-trigger`}
        aria-controls={panelId}
        className={cn(
          "group flex w-full items-center justify-between gap-3 text-left",
          "text-sm font-medium text-foreground",
          "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "rounded-md transition-colors",
          density === "compact" ? "px-3 py-2" : "px-4 py-3",
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
          <span className="truncate">{title}</span>
          {badge && (
            <Badge variant="info" className="ml-1 text-[10px]">
              {badge}
            </Badge>
          )}
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0",
            open && "rotate-90",
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      >
        <div className={cn(density === "compact" ? "px-3 pb-3 pt-1" : "px-4 pb-4 pt-1")}>
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
