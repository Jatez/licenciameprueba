import type { CSSProperties, ReactNode } from "react";

interface BodyCardProps {
  children: ReactNode;
  mobileMenuButton?: ReactNode;
  /** Reserved bottom space (px) so the persistent player doesn't cover content. */
  bottomInset?: number;
}

/**
 * Floating content card.
 * - 10px gap on all sides (`m-[0.625rem]`)
 * - 18px radius (`rounded-card`)
 * - Fixed height of 100dvh minus the 10px top+bottom margins; inner content scrolls vertically.
 * - On desktop, leaves room for the fixed sidebar via `md:ml-[calc(13.1875rem+0.625rem)]`
 * - When `bottomInset > 0`, adds extra padding-bottom so the persistent player
 *   doesn't sit on top of the last row of content.
 */
export function BodyCard({ children, mobileMenuButton, bottomInset = 0 }: BodyCardProps) {
  const paddingBottom = bottomInset > 0 ? bottomInset + 24 : undefined;
  const style: CSSProperties = {
    paddingTop: "env(safe-area-inset-top)",
  };
  if (paddingBottom !== undefined) {
    style.paddingBottom = `calc(${paddingBottom}px + env(safe-area-inset-bottom))`;
  } else {
    style.paddingBottom = "calc(1.5rem + env(safe-area-inset-bottom))";
  }
  return (
    <main
      className="bg-bodycard-bg h-[100dvh] overflow-y-auto overflow-x-clip scrollbar-minimal px-mobile-gutter relative pt-0 md:rounded-card md:m-[0.625rem] md:h-[calc(100dvh-1.25rem)] md:px-8 md:py-12 md:ml-[calc(13.1875rem+0.625rem)]"
      style={style}
    >
      {mobileMenuButton && (
        <div className="md:hidden absolute top-[1rem] right-[1rem] z-40">{mobileMenuButton}</div>
      )}
      {children}
    </main>
  );
}
