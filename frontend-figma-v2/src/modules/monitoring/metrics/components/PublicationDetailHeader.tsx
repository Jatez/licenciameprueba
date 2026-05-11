import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  metricsStrings,
  platformLabels,
} from "@/modules/monitoring/metrics/strings";
import type { PublicationMetric } from "@/modules/monitoring/metrics/types";

export interface PublicationDetailHeaderProps {
  pub: PublicationMetric;
  absoluteDate: (iso: string) => string;
  relativeDate: (iso: string) => string;
}

export function PublicationDetailHeader({
  pub,
  absoluteDate,
  relativeDate,
}: PublicationDetailHeaderProps) {
  const t = metricsStrings.publicationDetail;
  return (
    <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <img
          src={pub.trackCoverUrl}
          alt=""
          loading="lazy"
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">{pub.trackTitle}</h1>
          <p className="text-sm text-foreground/60">{pub.trackArtist}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground/70">
            <span className="rounded-full bg-foreground/5 px-2 py-0.5 font-medium">
              {platformLabels[pub.platform]}
            </span>
            <span>·</span>
            <span>
              {t.publishedOn}{" "}
              <span className="text-foreground">{absoluteDate(pub.publishedAt)}</span>{" "}
              <span className="text-foreground/50">({relativeDate(pub.publishedAt)})</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-2 md:items-end">
        <Button
          asChild
          variant="outline"
          disabled={!pub.postUrl}
          className="gap-1.5"
          title={!pub.postUrl ? t.viewOnPlatformDisabled : undefined}
        >
          <a href={pub.postUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {t.viewOnPlatform}
          </a>
        </Button>
      </div>
    </Card>
  );
}