import { Link } from "react-router-dom";
import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packagesStrings } from "@/modules/packages/packages/strings";

interface PackagesPageHeaderProps {
  showBack?: boolean;
}

export function PackagesPageHeader({ showBack }: PackagesPageHeaderProps) {
  const s = packagesStrings.page;
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between pt-mobile-stack-lg">
      <div className="space-y-1">
        {showBack ? (
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/packages">
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              {s.backToPackages}
            </Link>
          </Button>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {s.title}
        </h1>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>
      <Button asChild variant="outline">
        <Link to="/packages/history">
          <History className="mr-2 h-4 w-4" aria-hidden="true" />
          {s.historyCta}
        </Link>
      </Button>
    </header>
  );
}
