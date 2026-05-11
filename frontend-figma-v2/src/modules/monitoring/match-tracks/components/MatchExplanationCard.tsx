import { Card } from "@/components/ui/card";
import { matchTracksStrings } from "../strings";

const STEPS = matchTracksStrings.hub.explanation.steps;

export function MatchExplanationCard() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground">
        {matchTracksStrings.hub.explanation.title}
      </h3>
      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, idx) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-foreground">
              {idx + 1}
            </span>
            <p className="text-sm text-foreground">{step}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">{matchTracksStrings.hub.demoNote}</p>
    </Card>
  );
}
