import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";
import { BackButton } from "./BackButton";

interface TrackDetailFrostedNavProps {
  /** Title of the current track — shown as the trailing breadcrumb segment. */
  trackTitle?: string;
}

/**
 * Sticky frosted breadcrumb for the Track Detail page.
 * Standard pattern for level-2/3 sub-views: `Explorar música > [Track]`.
 * Wraps BackButton + the breadcrumb in the standard FrostedHeader recipe
 * (top, default intensity, headroom show/hide on scroll).
 */
export function TrackDetailFrostedNav({ trackTitle }: TrackDetailFrostedNavProps = {}) {
  const { isVisible } = useHeadroom();
  return (
    <FrostedHeader
      position="top"
      intensity="default"
      translateY={isVisible ? "0" : "-100%"}
      className="-mx-4 -mt-14 px-4 py-3 md:-mx-10 md:-mt-12 md:px-10 md:pt-6 md:pb-4"
    >
      <div className="flex flex-col gap-1.5">
        <BackButton />
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li className="shrink-0">
              <Link to="/catalog" className="hover:text-foreground">
                Explorar música
              </Link>
            </li>
            {trackTitle && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                <li className="truncate font-medium text-foreground">{trackTitle}</li>
              </>
            )}
          </ol>
        </nav>
      </div>
    </FrostedHeader>
  );
}
