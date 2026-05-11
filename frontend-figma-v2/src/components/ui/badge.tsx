import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-foreground",
        secondary: "bg-secondary text-foreground border border-lm-gray-300",
        destructive: "bg-destructive text-foreground",
        outline: "text-foreground border border-border",
        vigente: "bg-success-subtle text-foreground",
        consumida: "bg-consumida-subtle text-foreground",
        expirada: "bg-error-subtle text-foreground",
        pendiente: "bg-warning-subtle text-foreground",
        info: "bg-info-subtle text-foreground",
        metric: "bg-metric-subtle/[0.63] text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
