import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { licensesStrings } from "../strings";

export function HiddenTrackBanner({ trackId }: { trackId: string }) {
  const t = licensesStrings.detail.hiddenBanner;
  return (
    <div className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{t.title}</p>
          <p className="text-xs text-foreground/80">{t.body}</p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/admin/catalog?id=${trackId}`}>{t.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
