import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  primaryCta?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; onClick: () => void };
}

export function Modal({ open, onClose, title, children, primaryCta, secondaryCta }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] bg-lm-black/50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface rounded-xl shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground mb-5">{children}</div>
        <div className="flex justify-end gap-2">
          {secondaryCta && (
            <button
              onClick={secondaryCta.onClick}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-lm-black/20 text-lm-black hover:bg-lm-black/5"
            >
              {secondaryCta.label}
            </button>
          )}
          {primaryCta && (
            <button
              onClick={primaryCta.onClick}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-lm-black text-white hover:bg-lm-black/90"
            >
              {primaryCta.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
