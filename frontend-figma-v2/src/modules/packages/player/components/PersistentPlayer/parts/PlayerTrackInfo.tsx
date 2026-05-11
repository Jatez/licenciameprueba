import { Heart, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TrackSummary } from "@/api/types";
import { useFeatureFlag } from "@/shared/hooks";
import { useToggleFavorite } from "@/modules/tracks/hooks/useToggleFavorite";
import { playerStrings } from "../../../strings";

interface PlayerTrackInfoProps {
  track: TrackSummary;
}

export function PlayerTrackInfo({ track }: PlayerTrackInfoProps) {
  const favoritesEnabled = useFeatureFlag("FEATURE_FAVORITES");
  const toggleFavorite = useToggleFavorite();
  const favoriteLabel = track.isFavorite
    ? playerStrings.removeFromFavorites
    : playerStrings.addToFavorites;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-lm-gray-200">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lm-gray-500">
            <Music size={20} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-lm-gray-900">{track.title}</p>
        <p className="truncate text-xs text-lm-gray-500">{track.artist}</p>
      </div>
      {favoritesEnabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              aria-label={favoriteLabel}
              aria-pressed={track.isFavorite}
              onClick={() => toggleFavorite.mutate(track.id)}
            >
              <Heart
                size={18}
                className={cn(
                  "transition-colors",
                  track.isFavorite ? "fill-error text-error" : "text-lm-gray-500",
                )}
                aria-hidden="true"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{favoriteLabel}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
