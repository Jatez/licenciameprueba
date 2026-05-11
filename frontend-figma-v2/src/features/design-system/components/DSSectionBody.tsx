import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DSSectionBodyLayout = "split" | "foundation" | "article";

interface DSSectionBodyProps {
  layout?: DSSectionBodyLayout;
  /** Used in `split` layout — context column (anatomy, usage, a11y, tokens). */
  left?: ReactNode;
  /** Used in `split` layout — visual column (preview, variants, states, code). */
  right?: ReactNode;
  /** Used in `foundation` and `article` layouts. */
  children?: ReactNode;
  className?: string;
}

/**
 * Layout wrapper for DS section bodies.
 *
 * - `split` (default): on ≥md a 5/7 grid (left=context, right=visual).
 *   On mobile stacks with the visual preview FIRST and the context AFTER.
 * - `foundation`: single wide column (max-w-5xl) for token grids.
 * - `article`: narrow centered prose (max-w-3xl) for written docs.
 */
export function DSSectionBody({
  layout = "split",
  left,
  right,
  children,
  className,
}: DSSectionBodyProps) {
  if (layout === "foundation") {
    return (
      <div className={cn("mx-auto w-full max-w-5xl", className)}>{children}</div>
    );
  }

  if (layout === "article") {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-3xl text-foreground leading-relaxed",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // split
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-8 md:grid md:grid-cols-12 md:gap-8 lg:gap-10",
        className,
      )}
    >
      <div className="md:col-span-5 min-w-0 space-y-6">{left}</div>
      <div className="md:col-span-7 min-w-0 space-y-6">{right}</div>
    </div>
  );
}
