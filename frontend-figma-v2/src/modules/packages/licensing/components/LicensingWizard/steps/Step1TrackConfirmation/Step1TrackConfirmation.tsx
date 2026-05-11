import { useNavigate } from "react-router-dom";
import { AlertCircle, FileQuestion, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/modules/packages/dashboards/dashboard/components/EmptyState";
import { useTrackDetail } from "@/modules/tracks/hooks/useTrackDetail";
import { isApiError } from "@/api/client";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { TrackCard } from "./TrackCard";

interface Props {
  trackId: string;
  onContinue: () => void;
  onCancel: () => void;
}

export function Step1TrackConfirmation({ trackId, onContinue, onCancel }: Props) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useTrackDetail(trackId);
  const t = licensingStrings.step1;

  if (isLoading) {
    return <Step1Skeleton />;
  }

  if (isError) {
    const code = isApiError(error) ? error.code : undefined;
    if (code === "TRACK_NOT_FOUND") {
      return (
        <EmptyState
          icon={FileQuestion}
          title={t.trackNotFound.title}
          description={t.trackNotFound.description}
          ctaLabel={t.trackNotFound.cta}
          ctaHref="/catalog"
        />
      );
    }
    if (code === "TRACK_REMOVED") {
      return (
        <EmptyState
          icon={Music}
          title={t.trackRemoved.title}
          description={t.trackRemoved.description}
          ctaLabel={t.trackRemoved.cta}
          ctaHref="/catalog"
        />
      );
    }
    return (
      <EmptyState
        icon={AlertCircle}
        title={t.loadError.title}
        description={t.loadError.description}
        ctaLabel={t.loadError.cta}
        ctaHref="/catalog"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 py-[48px]">
      <div>
        <p className="text-sm text-muted-foreground">{t.intro}</p>
      </div>
      <TrackCard track={data!.track} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="lg" onClick={onCancel}>
          {t.continueNo}
        </Button>
        <div className="flex flex-col gap-1.5 sm:items-end">
          <span className="text-sm font-medium text-foreground">
            {t.continueQuestion}
          </span>
          <Button size="lg" onClick={onContinue}>
            {t.continueYes}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Step1Skeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-48" />
      <Card className="p-5">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Skeleton className="h-40 w-40 flex-shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-9 w-40" />
          </div>
        </div>
        <div className="mt-5 flex gap-2 border-t border-border pt-4">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </Card>
    </div>
  );
}
