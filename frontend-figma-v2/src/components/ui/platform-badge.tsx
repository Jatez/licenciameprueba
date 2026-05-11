import { Facebook, Instagram, Music2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type PlatformId = "instagram" | "tiktok" | "facebook";

const PLATFORM_ICON = {
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
} as const;

const PLATFORM_LABEL: Record<PlatformId, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

const containerVariants = cva(
  "inline-flex items-center justify-center rounded-full bg-foreground text-background shrink-0",
  {
    variants: {
      size: {
        xs: "h-5 w-5",
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

const ICON_SIZE: Record<NonNullable<VariantProps<typeof containerVariants>["size"]>, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export interface PlatformBadgeProps
  extends VariantProps<typeof containerVariants> {
  platform: PlatformId;
  /** Renderiza el nombre de la plataforma al lado del chip. */
  withLabel?: boolean;
  className?: string;
}

/**
 * Logo de aplicación social unificado: chip circular con fondo
 * `bg-foreground` (negro) e icono `text-background` (blanco).
 *
 * Regla del DS: TODOS los logos de IG/TT/FB en el producto usan este
 * recipe. La diferenciación visual viene del icono mismo, nunca del
 * color de fondo. No instanciar `<Instagram />` / `<Music2 />` /
 * `<Facebook />` directos en features.
 */
export function PlatformBadge({
  platform,
  size = "sm",
  withLabel = false,
  className,
}: PlatformBadgeProps) {
  const Icon = PLATFORM_ICON[platform];
  const label = PLATFORM_LABEL[platform];
  const iconSize = ICON_SIZE[size ?? "sm"];

  const chip = (
    <span
      className={cn(containerVariants({ size }), !withLabel && className)}
      aria-label={withLabel ? undefined : label}
      role={withLabel ? undefined : "img"}
    >
      <Icon className={iconSize} aria-hidden="true" />
    </span>
  );

  if (!withLabel) return chip;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {chip}
      <span className="text-sm text-foreground">{label}</span>
    </span>
  );
}
