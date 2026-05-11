import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DSComponentSpecLayout = "stack" | "split" | "foundation" | "article";

interface DSComponentSpecProps {
  description?: string;
  children: ReactNode;
  /**
   * Visual layout the children render in.
   * - "stack" (default, backwards-compatible): description + children stacked.
   * - "split" / "foundation" / "article": description sits above; children
   *   are expected to be a `<DSSectionBody />` configured with that layout.
   */
  layout?: DSComponentSpecLayout;
}

/**
 * Optional wrapper that renders an intro paragraph before the spec blocks.
 * The blocks themselves (DSAnatomy, DSVariants, DSStates, DSTokens, DSA11y, DSUsage, DSCode)
 * should be passed as children in the canonical order.
 */
export function DSComponentSpec({ description, children, layout = "stack" }: DSComponentSpecProps) {
  return (
    <div className={cn(layout === "article" && "mx-auto max-w-3xl")}>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
