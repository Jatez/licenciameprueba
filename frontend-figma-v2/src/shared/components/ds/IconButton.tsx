import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TouchTooltip } from "./TouchTooltip";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** Required — used as `aria-label` and as default tooltip text. */
  label: string;
  /** Optional override for the visible tooltip text. */
  tooltip?: string;
  /** Visual size. `md` is 44×44 (WCAG touch target). */
  size?: "sm" | "md";
  variant?: "ghost" | "outline" | "solid";
  children: ReactNode;
}

const sizeClasses: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
};

const variantClasses: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  ghost: "bg-transparent text-foreground hover:bg-accent",
  outline: "border border-border bg-background text-foreground hover:bg-accent",
  solid: "bg-primary text-ink-900 hover:bg-primary/90",
};

/**
 * IconButton — accessible icon-only button.
 *
 * - `label` is mandatory (becomes `aria-label`).
 * - Wrapped in `TouchTooltip` so the label is discoverable on hover (desktop)
 *   and tap (mobile).
 * - Default size `md` is 44×44 (WCAG 2.1 touch target).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, tooltip, size = "md", variant = "ghost", className, children, ...rest },
    ref,
  ) {
    return (
      <TouchTooltip label={tooltip ?? label}>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            sizeClasses[size],
            variantClasses[variant],
            className,
          )}
          {...rest}
        >
          {children}
        </button>
      </TouchTooltip>
    );
  },
);