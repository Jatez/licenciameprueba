import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/shared/hooks/useScrollSpy";

export interface SectionTOCItem {
  id: string;
  label: string;
}

export interface SectionTOCProps {
  items: SectionTOCItem[];
  ariaLabel: string;
  className?: string;
}

/**
 * Sticky table-of-contents with scroll-spy.
 *
 * - On `lg+`: vertical nav (left rail), `aria-current="location"` on active item.
 * - On `<lg`: horizontal sticky tab strip with overflow-x scroll.
 *
 * Click smooth-scrolls to the section and updates the URL hash without reloading.
 */
export function SectionTOC({ items, ariaLabel, className }: SectionTOCProps) {
  const ids = items.map((i) => i.id);
  const activeId = useScrollSpy(ids);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        // Mobile: horizontal sticky strip
        "sticky top-[60px] z-20 -mx-4 mb-2 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        // Desktop: vertical sticky rail
        "lg:top-20 lg:z-10 lg:mx-0 lg:mb-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-b-0 lg:border-l lg:border-border lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none lg:supports-[backdrop-filter]:bg-transparent",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              // Base
              "shrink-0 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              // Mobile (tab style)
              "border-b-2 px-3 py-2",
              isActive
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
              // Desktop (vertical rail) — overrides
              "lg:rounded-none lg:border-b-0 lg:border-l-2 lg:-ml-px lg:px-3 lg:py-2",
              isActive
                ? "lg:border-l-metric lg:bg-metric-subtle/[0.63] lg:text-metric lg:font-medium"
                : "lg:border-l-transparent lg:hover:bg-muted/50 lg:hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
