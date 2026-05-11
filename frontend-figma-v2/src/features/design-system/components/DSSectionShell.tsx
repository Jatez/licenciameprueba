import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DSSectionBodyLayout } from "./DSSectionBody";

interface DSSectionShellProps {
  children: ReactNode;
  hidden?: boolean;
  /**
   * Outer width treatment for the section.
   * - "default" (most): no extra width cap → respects the page container.
   * - "wide": caps at max-w-6xl, centered (split-friendly sections).
   * - "foundation": caps at max-w-5xl, centered.
   * - "article": caps at max-w-3xl, centered, prose-friendly.
   *
   * For "split" layouts the section file should render `<DSSectionBody layout="split">`
   * inside; the shell does not impose width caps in that case.
   */
  layout?: DSSectionBodyLayout | "default" | "wide";
}

const WIDTH_BY_LAYOUT: Record<NonNullable<DSSectionShellProps["layout"]>, string> = {
  default: "",
  split: "",
  wide: "mx-auto max-w-6xl",
  foundation: "mx-auto max-w-5xl",
  article: "mx-auto max-w-3xl",
};

export function DSSectionShell({ children, hidden, layout = "default" }: DSSectionShellProps) {
  return (
    <section
      className={cn(
        "mb-16",
        WIDTH_BY_LAYOUT[layout],
        hidden && "opacity-30 pointer-events-none",
      )}
    >
      {children}
    </section>
  );
}
