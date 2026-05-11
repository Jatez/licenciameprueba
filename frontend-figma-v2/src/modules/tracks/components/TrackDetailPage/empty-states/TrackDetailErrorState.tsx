import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { catalogStrings } from "@/modules/tracks/strings";

interface TrackDetailErrorStateProps {
  onRetry: () => void;
}

export function TrackDetailErrorState({ onRetry }: TrackDetailErrorStateProps) {
  const s = catalogStrings.trackDetailStates.error;
  return (
    <Alert variant="destructive" className="flex flex-col items-start gap-3">
      <AlertTitle>{s.title}</AlertTitle>
      <AlertDescription>{s.description}</AlertDescription>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {s.retry}
      </Button>
    </Alert>
  );
}
