import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import type { TopSongSort, TopTrack } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";
import { useTopTracksSort } from "../../hooks/useTopTracksSort";
import { TopTrackRow } from "./TopTrackRow";

interface TopTracksProps {
  tracks: TopTrack[];
  isLoading?: boolean;
}

const sortLabelByValue: Record<TopSongSort, string> = {
  licenses: dashboardV2Strings.topTracks.sortByLicenses,
  impressions: dashboardV2Strings.topTracks.sortByImpressions,
  credits: dashboardV2Strings.topTracks.sortByCredits,
};

export function TopTracks({ tracks, isLoading }: TopTracksProps) {
  const navigate = useNavigate();
  const t = dashboardV2Strings.topTracks;
  const { sort, setSort, sorted } = useTopTracksSort(tracks);

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col gap-4 border-border bg-card p-6 text-card-foreground">
        <Skeleton className="h-5 w-56 bg-foreground/10" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-md bg-foreground/10" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4 bg-foreground/10" />
              <Skeleton className="h-3 w-1/2 bg-foreground/10" />
            </div>
            <Skeleton className="h-3 w-16 bg-foreground/10" />
          </div>
        ))}
      </Card>
    );
  }

  if (!tracks.length) {
    return (
      <Card className="flex h-full flex-col border-border bg-card p-6 text-card-foreground">
        <h2 className="mb-2 text-base font-semibold text-foreground">{t.title}</h2>
        <div className="flex flex-1 items-center justify-center">
          <EmptyStateCard
            icon={Music}
            title={t.empty}
            description={t.emptyDescription}
            ctaLabel={t.emptyCta}
            ctaHref="/catalog"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col gap-3 border-border bg-card p-6 text-card-foreground">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as TopSongSort)}>
          <SelectTrigger
            aria-label={t.sortLabel}
            className="h-8 w-[180px] border-border bg-card text-xs text-foreground hover:bg-accent focus:ring-primary"
          >
            <SelectValue>{sortLabelByValue[sort]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="licenses">{t.sortByLicenses}</SelectItem>
            <SelectItem value="impressions">{t.sortByImpressions}</SelectItem>
            <SelectItem value="credits">{t.sortByCredits}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ol className="flex flex-col" aria-label={t.title}>
        {sorted.map((track, idx) => (
          <Fragment key={track.id}>
            <TopTrackRow track={track} position={idx + 1} sort={sort} />
            {idx < sorted.length - 1 && <Separator className="my-0.5 bg-border" />}
          </Fragment>
        ))}
      </ol>
      <Button
        variant="link"
        size="sm"
        className="self-start px-0 text-foreground hover:text-foreground/70"
        onClick={() => navigate("/catalog")}
      >
        {t.viewAll} →
      </Button>
    </Card>
  );
}
