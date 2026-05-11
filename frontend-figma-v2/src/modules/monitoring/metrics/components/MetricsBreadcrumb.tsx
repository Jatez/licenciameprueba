/**
 * F-11 · Inline breadcrumb (no DS primitive yet — kept minimal here).
 * If we add a global Breadcrumb to the design-system, swap in-place.
 */
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface MetricsBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function MetricsBreadcrumb({ items }: MetricsBreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-foreground/60">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="hover:text-foreground hover:underline underline-offset-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground" : undefined}>{item.label}</span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3 text-foreground/40" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
