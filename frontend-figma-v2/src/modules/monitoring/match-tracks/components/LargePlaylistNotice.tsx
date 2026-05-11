import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

interface LargePlaylistNoticeProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function LargePlaylistNotice({
  page,
  totalPages,
  onPrev,
  onNext,
}: LargePlaylistNoticeProps) {
  const copy = s.spotify.largePlaylist;
  return (
    <Card className="flex flex-wrap items-center justify-between gap-4 border-warning bg-warning-subtle p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-foreground" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-foreground">{copy.title}</p>
          <p className="text-xs text-foreground/80">{copy.body}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onPrev} disabled={page <= 1}>
          {copy.prev}
        </Button>
        <span className="text-xs tabular-nums text-foreground">
          {copy.pageOf(page, totalPages)}
        </span>
        <Button size="sm" variant="outline" onClick={onNext} disabled={page >= totalPages}>
          {copy.next}
        </Button>
      </div>
    </Card>
  );
}
