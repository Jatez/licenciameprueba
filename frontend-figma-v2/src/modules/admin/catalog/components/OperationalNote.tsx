import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { catalogStrings } from "../strings";

/**
 * Internal product note — surfaces SOW gaps as visible UI without
 * looking like an error. Replace once operational flow is defined.
 */
export function OperationalNote() {
  const t = catalogStrings.operationalNote;
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-start gap-3 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-foreground">
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="space-y-1.5">
          <Badge variant="secondary">{t.badge}</Badge>
          <p className="text-sm font-semibold text-foreground">{t.title}</p>
          <p className="text-sm text-muted-foreground">{t.body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
