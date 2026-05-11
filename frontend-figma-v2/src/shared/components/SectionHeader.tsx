import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Render as <h1> for page-level headers, <h2> by default for sections. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  as: Tag = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <Tag
          className={cn(
            "tracking-tight text-foreground",
            Tag === "h1" && "text-2xl font-semibold md:text-3xl",
            Tag === "h2" && "text-xl font-semibold md:text-2xl",
            Tag === "h3" && "text-lg font-semibold",
          )}
        >
          {title}
        </Tag>
        {subtitle && <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}