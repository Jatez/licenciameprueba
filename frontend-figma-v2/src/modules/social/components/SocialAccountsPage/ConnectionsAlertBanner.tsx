import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { socialStrings } from "@/modules/social/strings";
import type { SocialAccount } from "@/api/types";
import { resolveAccountState } from "../SocialAccountCard/SocialAccountCard.utils";

interface ConnectionsAlertBannerProps {
  accounts: SocialAccount[] | undefined;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function ConnectionsAlertBanner({ accounts }: ConnectionsAlertBannerProps) {
  const copy = socialStrings.banner;
  const [dismissed, setDismissed] = useState(false);
  const problematic = (accounts ?? []).filter((a) => {
    const state = resolveAccountState(a);
    return state === "token_expired" || state === "error";
  });

  if (problematic.length === 0 || dismissed) return null;

  const first = problematic[0];
  const text =
    problematic.length === 1
      ? copy.single
      : interpolate(copy.plural, { count: String(problematic.length) });

  const handleScroll = () => {
    const el = document.getElementById(`card-${first.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus({ preventScroll: true });
    }
  };

  return (
    <Alert
      role="status"
      className="bg-warning/10 border-warning/30 text-foreground flex items-center gap-3"
    >
      <AlertTriangle className="h-4 w-4 text-warning shrink-0" aria-hidden="true" />
      <AlertDescription className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-sm">{text}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleScroll}
          aria-controls={`card-${first.id}`}
        >
          {copy.cta}
        </Button>
      </AlertDescription>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={copy.dismiss}
        className="shrink-0 rounded-md p-1 text-foreground/70 hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </Alert>
  );
}
