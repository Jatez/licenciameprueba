import { useState } from "react";
import { BarChart2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { socialStrings } from "@/modules/social/strings";

export function SocialContextCard() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <Card className="flex items-center gap-3 p-4 bg-info-subtle border-0">
      <BarChart2 size={20} className="shrink-0 text-foreground" aria-hidden="true" />
      <p className="flex-1 text-sm text-foreground leading-snug">
        {socialStrings.contextBanner.text}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={socialStrings.contextBanner.dismiss}
        className="shrink-0 rounded-md p-1 text-foreground/70 hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </Card>
  );
}
