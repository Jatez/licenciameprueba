import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  trackId: string;
  trackTitle?: string;
}

/**
 * Standard hierarchical breadcrumb for level-3 sub-views:
 * `Explorar música > [Track] > Licenciar [Track]`.
 */
export function LicensingWizardBreadcrumb({ trackId, trackTitle }: Props) {
  const titleLabel = trackTitle ?? "Canción";
  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2 md:px-10 md:py-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li className="shrink-0">
          <Link to="/catalog" className="hover:text-foreground">
            Explorar música
          </Link>
        </li>
        <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
        <li className="shrink-0">
          <Link to={`/catalog/${trackId}`} className="truncate hover:text-foreground">
            {titleLabel}
          </Link>
        </li>
        <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
        <li className="truncate font-medium text-foreground">
          Licenciar {titleLabel}
        </li>
      </ol>
    </nav>
  );
}
