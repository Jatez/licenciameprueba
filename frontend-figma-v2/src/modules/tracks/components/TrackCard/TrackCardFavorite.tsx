import { type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { useToggleFavorite } from "@/modules/tracks/hooks/useToggleFavorite";
import { catalogStrings } from "@/modules/tracks/strings";

interface TrackCardFavoriteProps {
  trackId: string;
  isFavorite: boolean;
}

/** Heart toggle, hidden when FEATURE_FAVORITES is off. */
export function TrackCardFavorite({ trackId, isFavorite }: TrackCardFavoriteProps) {
  const enabled = useFeatureFlag("FEATURE_FAVORITES");
  const toggle = useToggleFavorite();
  if (!enabled) return null;

  const label = isFavorite
    ? catalogStrings.trackCard.removeFromFavorites
    : catalogStrings.trackCard.addToFavorites;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggle.mutate(trackId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isFavorite}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", isFavorite && "fill-error text-error")}
        aria-hidden="true"
      />
    </button>
  );
}
