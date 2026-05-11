import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { catalogStrings } from "@/modules/tracks/strings";

interface TrackDetailMoodsTagsProps {
  moods: string[];
  tags?: string[];
}

export function TrackDetailMoodsTags({ moods }: TrackDetailMoodsTagsProps) {
  const navigate = useNavigate();
  const showMoods = moods.length > 0;
  if (!showMoods) return null;

  return (
    <div className="space-y-4">
      {showMoods ? (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            {catalogStrings.trackDetail.metadata.moods}
          </p>
          <ul className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <li key={mood}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/catalog?moods=${encodeURIComponent(mood)}`)
                  }
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                    {mood}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
