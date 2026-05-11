import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

/** Outer shell — paints the sidebar-bg margin around the floating BodyCard. */
export function PageShell({ children }: PageShellProps) {
  return <div className="h-[100dvh] bg-sidebar-bg overflow-hidden">{children}</div>;
}
