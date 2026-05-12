import { Disc } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Track } from "@/api/types";
import { TrackMetadataBlock } from "./TrackMetadataBlock";
import { TrackPreviewButton } from "./TrackPreviewButton";
import { PlatformLicensabilityRow } from "./PlatformLicensabilityRow";

interface Props {
  track: Track;
}

/** Read-only confirmation card for the track being licensed. */
export function TrackCard({ track }: Props) {
  return (
    <Card className="overflow-hidden p-4 md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt=""
              className="h-32 w-32 rounded-lg object-cover md:h-36 md:w-36"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-lg bg-muted md:h-36 md:w-36"
              aria-hidden="true"
            >
              <Disc className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <div>
            <h2 className="text-xl font-semibold leading-tight text-foreground">
              {track.title}
            </h2>
            <p className="text-sm text-muted-foreground">{track.artist}</p>
          </div>
          <TrackMetadataBlock track={track} />
          <div>
            <TrackPreviewButton track={track} />
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-border pt-3.5">
        <PlatformLicensabilityRow platforms={track.platformLicensability} />
      </div>
    </Card>
  );
}
