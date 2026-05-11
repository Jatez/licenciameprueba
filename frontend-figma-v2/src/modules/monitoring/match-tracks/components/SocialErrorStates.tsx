import { AlertOctagon, Inbox, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

interface PlatformErrorStateProps {
  onRetry: () => void;
}

export function PlatformErrorState({ onRetry }: PlatformErrorStateProps) {
  const copy = s.social.errors.platform;
  return (
    <Card className="border-error bg-error-subtle p-6">
      <div className="flex items-start gap-3">
        <AlertOctagon className="mt-0.5 h-6 w-6 text-foreground" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{copy.title}</h3>
          <p className="mt-1 text-sm text-foreground/80">{copy.body}</p>
          <Button className="mt-4" onClick={onRetry}>
            {copy.retry}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function NoPostsDetectedState() {
  const copy = s.social.errors.noPosts;
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-lm-gray-100 text-foreground">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{copy.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{copy.body}</p>
    </Card>
  );
}

export function NoMetadataNotice() {
  const copy = s.social.errors.noMetadata;
  return (
    <Card className="flex items-start gap-3 border-border bg-background p-4">
      <FileQuestion className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-foreground">{copy.title}</p>
        <p className="text-xs text-muted-foreground">{copy.body}</p>
      </div>
    </Card>
  );
}
