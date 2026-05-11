import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RowCardField {
  label: ReactNode;
  value: ReactNode;
}

export interface RowCardProps {
  badge?: { text: ReactNode; variant?: "default" | "muted" };
  topRight?: ReactNode;
  cover?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  fields?: RowCardField[];
  primaryAction?: { label: ReactNode; onClick: () => void };
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * RowCard — canonical mobile representation of a tabular row.
 * Used as the mobile fallback for `<DataTable mobileView="cards" />`
 * and for ad-hoc mobile lists. Desktop equivalent is a `<TableRow>`.
 */
export function RowCard({
  badge,
  topRight,
  cover,
  title,
  subtitle,
  fields,
  primaryAction,
  onClick,
  className,
  ariaLabel,
}: RowCardProps) {
  const interactive = Boolean(onClick);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "p-4",
        interactive &&
          "cursor-pointer transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {(badge || topRight) && (
        <div className="mb-2 flex items-start justify-between gap-3">
          {badge ? (
            <Badge
              variant={badge.variant === "muted" ? "secondary" : "default"}
              className="font-mono text-[11px]"
            >
              {badge.text}
            </Badge>
          ) : (
            <span />
          )}
          {topRight && (
            <div onClick={(e) => e.stopPropagation()}>{topRight}</div>
          )}
        </div>
      )}

      <div className={cn("flex items-start gap-3", !cover && "block")}>
        {cover && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
            {cover}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground">
            {title}
          </div>
          {subtitle && (
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {fields && fields.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {fields.map((f, i) => (
            <div key={i} className="min-w-0">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="mt-0.5 truncate font-medium text-foreground">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {primaryAction && (
        <div className="mt-3">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              primaryAction.onClick();
            }}
          >
            {primaryAction.label}
          </Button>
        </div>
      )}
    </Card>
  );
}