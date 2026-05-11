import { X } from "lucide-react";
import { toneIcon, toneIconColor, toneSurface, type NotifTone, type NotifVariant } from "./types";

interface BannerProps {
  tone: NotifTone;
  variant?: NotifVariant;
  title?: string;
  message: string;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  onClose?: () => void;
}

export function Banner({ tone, variant = "filled", title, message, primaryCta, secondaryCta, onClose }: BannerProps) {
  const Icon = toneIcon[tone];
  return (
    <div
      role="status"
      className={`rounded-lg px-4 py-3 flex items-center gap-3 ${toneSurface(tone, variant)}`}
    >
      <Icon aria-hidden="true" className={`shrink-0 h-5 w-5 ${toneIconColor[tone]}`} />
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
        {title && <p className="font-semibold text-sm shrink-0">{title}</p>}
        <p className="text-sm text-foreground/80 line-clamp-2 sm:line-clamp-1">{message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {secondaryCta && (
          <button
            onClick={secondaryCta.onClick}
            className="px-3 py-1.5 text-xs font-semibold rounded-pill bg-transparent text-lm-black border border-lm-black/20 hover:bg-lm-black/5"
          >
            {secondaryCta.label}
          </button>
        )}
        {primaryCta && (
          <button
            onClick={primaryCta.onClick}
            className="px-4 py-1.5 text-xs font-semibold rounded-pill bg-lm-black text-white hover:bg-lm-black/90 inline-flex items-center gap-1.5"
          >
            {primaryCta.label}
            <span aria-hidden="true">→</span>
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="p-1 rounded text-lm-black/60 hover:text-lm-black"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
