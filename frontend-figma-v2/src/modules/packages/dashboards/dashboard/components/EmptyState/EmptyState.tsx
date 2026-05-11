import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center gap-3 text-center",
  {
    variants: {
      size: {
        sm: "px-4 py-6",
        md: "px-6 py-10",
      },
    },
    defaultVariants: { size: "md" },
  },
);

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  size,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ size }), className)}>
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-metric-subtle/[0.63]"
        aria-hidden="true"
      >
        <Icon className="h-6 w-6 text-metric" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {ctaLabel && ctaHref && (
        <Button asChild size="sm" className="mt-2">
          <Link to={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
