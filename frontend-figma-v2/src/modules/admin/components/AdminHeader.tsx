import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { adminStrings } from "../strings";

const SECTION_LABEL: Record<string, string> = {
  "": adminStrings.nav.overview,
  catalog: adminStrings.nav.catalog,
  companies: adminStrings.nav.companies,
  pricing: adminStrings.nav.pricing,
  licenses: adminStrings.nav.licenses,
  billing: adminStrings.nav.billing,
  audit: adminStrings.nav.audit,
  access: adminStrings.nav.access,
};

/**
 * Sticky breadcrumb header for the admin shell.
 * Pure UI — derives section name from the URL.
 */
export function AdminHeader() {
  const { pathname } = useLocation();
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const currentKey = segments[0] ?? "";
  const currentLabel = SECTION_LABEL[currentKey] ?? adminStrings.nav.overview;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 pb-3">
      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{adminStrings.brand.consoleName}</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-foreground font-medium">{currentLabel}</span>
      </nav>
      <Badge variant="secondary" className="font-medium">
        {adminStrings.overview.badgeDemo} · {adminStrings.user.roleLabel}
      </Badge>
    </header>
  );
}
