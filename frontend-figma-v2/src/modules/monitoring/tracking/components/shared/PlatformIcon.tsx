import { PlatformBadge, type PlatformId } from "@/components/ui/platform-badge";
import type { SocialPlatformF06 } from "@/api/types";

interface PlatformIconProps {
  platform: SocialPlatformF06;
  /** Tamaño numérico (px) — se mapea a las variantes del PlatformBadge. */
  size?: number;
  /** Renderiza el nombre de la plataforma junto al chip. */
  withLabel?: boolean;
  className?: string;
}

/**
 * Wrapper de compatibilidad. Delega en `<PlatformBadge />` (DS).
 * Mantiene la API previa (size numérico) para no romper consumidores
 * en `tracking`, `social` y `connect-flow`.
 */
export function PlatformIcon({
  platform,
  size = 16,
  withLabel = false,
  className,
}: PlatformIconProps) {
  const variant = mapNumericSize(size);
  return (
    <PlatformBadge
      platform={platform as PlatformId}
      size={variant}
      withLabel={withLabel}
      className={className}
    />
  );
}

function mapNumericSize(size: number): "xs" | "sm" | "md" | "lg" {
  if (size <= 14) return "xs";
  if (size <= 20) return "sm";
  if (size <= 32) return "md";
  return "lg";
}
