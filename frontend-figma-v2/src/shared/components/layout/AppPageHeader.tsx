import { useEffect, type ReactNode } from "react";
import { Menu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks/useHeadroom";

export interface AppPageHeaderProps {
  title: string;
  description?: string;
  meta?: { updatedAt?: string; onRefresh?: () => void };
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    "aria-label"?: string;
  };
  className?: string;
}

/**
 * Canonical page header.
 *
 * - Sticky FrostedHeader on both mobile and desktop, with progressive
 *   backdrop blur (mask-image gradient) and auto-hide on scroll-down via
 *   useHeadroom. Reappears on scroll-up.
 * - Desktop title aligns vertically with the sidebar logo (pt-6) by
 *   bleeding into the BodyCard's top padding (-mt-12 cancels md:pt-12,
 *   pt-6 matches the SidebarLogo's pt-6).
 * - Mobile keeps the 56px sticky bar with hamburger; description / meta
 *   live below the sticky surface so they scroll away normally.
 */
export function AppPageHeader({
  title,
  description,
  meta,
  primaryAction,
  className,
}: AppPageHeaderProps) {
  const openSidebar = useSidebarStore((s) => s.open);
  const registerHeader = useSidebarStore((s) => s.registerHeader);
  const unregisterHeader = useSidebarStore((s) => s.unregisterHeader);
  const { isVisible } = useHeadroom();

  useEffect(() => {
    registerHeader();
    return () => unregisterHeader();
  }, [registerHeader, unregisterHeader]);

  return (
    <div className={cn("md:mb-8", className)}>
      <FrostedHeader
        intensity="default"
        translateY={isVisible ? "0" : "-100%"}
        className={cn(
          // mobile: bleed to gutter, anchor at top
          "-mx-mobile-gutter px-mobile-gutter",
          // desktop: extend into BodyCard's md:py-12 and align title with sidebar logo (pt-6)
          "md:-mx-10 md:-mt-12 md:px-10 md:pt-6 md:pb-6",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Mobile row */}
        <div className="flex h-header-mobile items-center justify-between gap-2 md:hidden">
          <h1 className="truncate text-lg font-semibold leading-tight text-foreground">
            {title}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            {primaryAction && (
              <Button
                size="sm"
                onClick={primaryAction.onClick}
                aria-label={primaryAction["aria-label"] ?? primaryAction.label}
              >
                {primaryAction.icon}
                <span className="ml-1 hidden sm:inline">{primaryAction.label}</span>
              </Button>
            )}
            <button
              type="button"
              onClick={openSidebar}
              aria-label="Abrir menú"
              className="-mr-2 rounded-md p-2 text-foreground hover:bg-foreground/5"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Desktop row */}
        <div className="hidden w-full items-start justify-between gap-4 md:flex">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              aria-label={primaryAction["aria-label"] ?? primaryAction.label}
            >
              {primaryAction.icon}
              <span className="ml-2">{primaryAction.label}</span>
            </Button>
          )}
        </div>
      </FrostedHeader>

      {/* Mobile-only description + meta (non-sticky, scrolls with content) */}
      {(description || meta?.updatedAt) && (
        <div className="md:hidden mt-2 mb-mobile-stack-lg space-y-1">
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {meta?.updatedAt && (
            <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
              <span>Actualizado {meta.updatedAt}</span>
              {meta.onRefresh && (
                <button
                  type="button"
                  onClick={meta.onRefresh}
                  aria-label="Actualizar"
                  className="p-0.5 rounded hover:bg-foreground/5"
                >
                  <RefreshCw className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
            </p>
          )}
        </div>
      )}

      {/* Desktop-only description + meta (non-sticky, scrolls below the sticky bar) */}
      {(description || meta?.updatedAt) && (
        <div className="hidden md:block mt-3 space-y-2">
          {description && (
            <p className="max-w-3xl text-base text-muted-foreground">{description}</p>
          )}
          {meta?.updatedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Actualizado {meta.updatedAt}</span>
              {meta.onRefresh && (
                <button
                  type="button"
                  onClick={meta.onRefresh}
                  aria-label="Actualizar"
                  className="p-0.5 rounded hover:bg-foreground/5"
                >
                  <RefreshCw className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
