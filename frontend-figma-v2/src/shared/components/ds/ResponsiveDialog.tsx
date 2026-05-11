import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BottomSheet, type BottomSheetProps } from "./BottomSheet";

export interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  /** Force a specific variant regardless of viewport. */
  forceVariant?: "dialog" | "bottomSheet";
  /** BottomSheet snap-point on mobile. */
  initialSnap?: BottomSheetProps["initialSnap"];
  dismissible?: boolean;
  /** Extra classes for the desktop DialogContent. */
  contentClassName?: string;
}

/**
 * ResponsiveDialog — picks `<BottomSheet />` on mobile, `<Dialog />` on desktop.
 * Lets pages stop branching on viewport for confirm-style modals.
 */
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  forceVariant,
  initialSnap,
  dismissible = true,
  contentClassName,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  const variant = forceVariant ?? (isMobile ? "bottomSheet" : "dialog");

  if (variant === "bottomSheet") {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        initialSnap={initialSnap}
        dismissible={dismissible}
        footer={footer}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (dismissible || v ? onOpenChange(v) : undefined)}
    >
      <DialogContent
        className={cn("max-w-lg", contentClassName)}
        onPointerDownOutside={(e) => {
          if (!dismissible) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!dismissible) e.preventDefault();
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}