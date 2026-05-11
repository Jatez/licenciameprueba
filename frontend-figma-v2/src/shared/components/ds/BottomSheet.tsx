import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  /** "auto" → max-h 85dvh; "half" → 50dvh; "full" → 100dvh. */
  initialSnap?: "auto" | "half" | "full";
  /** When false, blocks scrim/Escape close. */
  dismissible?: boolean;
  /** Sticky footer at bottom; respects safe-area. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

const heightBySnap: Record<NonNullable<BottomSheetProps["initialSnap"]>, string> = {
  auto: "max-h-[85dvh]",
  half: "h-[50dvh]",
  full: "h-[100dvh]",
};

/**
 * BottomSheet — mobile sheet anchored to the bottom of the viewport.
 * Built on top of the canonical `<Sheet />` (Radix Dialog) primitive.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  initialSnap = "auto",
  dismissible = true,
  footer,
  children,
  className,
}: BottomSheetProps) {
  const block = (e: Event) => {
    if (!dismissible) e.preventDefault();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (dismissible || v ? onOpenChange(v) : undefined)}>
      <SheetContent
        side="bottom"
        onPointerDownOutside={block}
        onEscapeKeyDown={block}
        className={cn(
          "flex flex-col gap-0 rounded-t-2xl border-t p-0",
          heightBySnap[initialSnap],
          className,
        )}
      >
        {/* Grab handle */}
        <div className="flex shrink-0 items-center justify-center pt-2 pb-1">
          <span
            aria-hidden="true"
            className="h-1 w-8 rounded-full bg-foreground/20"
          />
        </div>

        {/* Header */}
        {(title || description) && (
          <div className="shrink-0 px-mobile-gutter pb-3 pt-1">
            {title && (
              <SheetTitle className="text-base font-semibold text-foreground">
                {title}
              </SheetTitle>
            )}
            {description && (
              <SheetDescription className="mt-1 text-sm text-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </div>
        )}
        {!title && !description && (
          <SheetTitle className="sr-only">Hoja inferior</SheetTitle>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-mobile-gutter pb-4">
          {children}
        </div>

        {/* Sticky footer */}
        {footer && (
          <div
            className="shrink-0 border-t border-border bg-background px-mobile-gutter pt-3"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}