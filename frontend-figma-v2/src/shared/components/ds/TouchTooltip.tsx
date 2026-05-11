import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface TouchTooltipProps {
  /** Visible label shown to sighted users on hover/tap. */
  label: string;
  /** The trigger element (must accept ref via Slot). */
  children: ReactNode;
  /** Optional content className. */
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * TouchTooltip — Tooltip on desktop (hover/focus), Popover on mobile (tap).
 *
 * Radix Tooltip does not respond to taps on touch devices, leaving icon-only
 * controls inaccessible to sighted mobile users. This wrapper switches to a
 * Popover on mobile so a tap reveals the label.
 *
 * Always pair with `aria-label` on the trigger for screen readers.
 */
export function TouchTooltip({
  label,
  children,
  contentClassName,
  side = "top",
}: TouchTooltipProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          side={side}
          className={cn("w-auto px-2 py-1 text-xs", contentClassName)}
        >
          {label}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={cn("text-xs", contentClassName)}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}