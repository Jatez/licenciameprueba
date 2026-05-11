import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packagesStrings } from "@/modules/packages/packages/strings";

export function WalletHubHeader() {
  const s = packagesStrings.walletHub;
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between pt-mobile-stack-lg">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {s.title}
        </h1>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>
      <Button asChild variant="outline">
        <Link to="/packages/history">
          <History className="mr-2 h-4 w-4" aria-hidden="true" />
          {packagesStrings.page.historyCta}
        </Link>
      </Button>
    </header>
  );
}
