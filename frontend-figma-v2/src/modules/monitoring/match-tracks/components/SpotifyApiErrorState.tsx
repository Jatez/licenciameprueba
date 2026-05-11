import { AlertOctagon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

interface SpotifyApiErrorStateProps {
  onRetry: () => void;
  onUseDemo: () => void;
}

export function SpotifyApiErrorState({ onRetry, onUseDemo }: SpotifyApiErrorStateProps) {
  const copy = s.spotify.apiError;
  return (
    <Card className="max-w-2xl border-error bg-error-subtle p-6">
      <div className="flex items-start gap-3">
        <AlertOctagon className="mt-0.5 h-6 w-6 text-foreground" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{copy.title}</h3>
          <p className="mt-1 text-sm text-foreground/80">{copy.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onRetry}>{copy.retry}</Button>
            <Button variant="outline" onClick={onUseDemo}>
              {copy.demo}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
