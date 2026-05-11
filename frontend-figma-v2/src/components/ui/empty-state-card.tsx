import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
  /** Variant for tone of icon container. Defaults to subtle. */
  tone?: "subtle" | "muted";
}

/**
 * Compact empty state for use INSIDE cards, tabs, or panels.
 * No heavy illustration — icon + title + description + optional CTA.
 *
 * For full-page or large-section empty states use the dashboard `EmptyState`.
 */
export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className,
  tone = "subtle",
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card px-4 py-8 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          tone === "subtle" ? "bg-metric-subtle/[0.63] text-metric" : "bg-muted text-muted-foreground",
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto max-w-xs text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {ctaLabel && (ctaHref || onCtaClick) && (
        <Button asChild={!!ctaHref} size="sm" variant="outline" onClick={onCtaClick}>
          {ctaHref ? <Link to={ctaHref}>{ctaLabel}</Link> : <span>{ctaLabel}</span>}
        </Button>
      )}
    </div>
  );
}
