import { useNavigate } from "react-router-dom";
import { Music, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { License } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  license: License;
}

export function LicenseAssociatedContent({ license }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.detail.associatedContent;

  // F-06 will populate this from real data. For now: empty placeholder.
  const hasPosts = false;

  if (!hasPosts) {
    return (
      <section
        aria-label={licensingStrings.detail.sections.associatedContent}
        className="rounded-xl border border-dashed border-border p-6 text-center"
      >
        <Music
          className="mx-auto h-8 w-8 text-muted-foreground"
          aria-hidden="true"
        />
        <h3 className="mt-3 text-sm font-semibold text-foreground">
          {t.noneTitle}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.noneDescription}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/social-accounts")}>
            <Wifi className="h-4 w-4" aria-hidden="true" />
            {t.connectSocialCta}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard03")}
          >
            {t.viewMetricsCta}
          </Button>
        </div>
        <span className="sr-only">{license.licenseTokenId}</span>
      </section>
    );
  }

  return null;
}
