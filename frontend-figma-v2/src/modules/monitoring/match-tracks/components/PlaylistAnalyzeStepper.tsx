import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyzeSteps } from "../mocks.spotify";
import { matchTracksStrings as s } from "../strings";

interface PlaylistAnalyzeStepperProps {
  onComplete: () => void;
}

const STEP_DURATION = 700;

export function PlaylistAnalyzeStepper({ onComplete }: PlaylistAnalyzeStepperProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= analyzeSteps.length) {
      const t = window.setTimeout(onComplete, 250);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCurrent((c) => c + 1), STEP_DURATION);
    return () => window.clearTimeout(t);
  }, [current, onComplete]);

  const percent = Math.min(100, Math.round((current / analyzeSteps.length) * 100));

  return (
    <Card className="max-w-2xl p-6">
      <h2 className="text-lg font-semibold text-foreground">{s.spotify.stepperTitle}</h2>
      <Progress value={percent} className="mt-4" />
      <ol className="mt-6 space-y-3">
        {analyzeSteps.map((step, idx) => {
          const done = idx < current;
          const active = idx === current;
          return (
            <li key={step.key} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  done
                    ? "bg-primary text-foreground"
                    : active
                      ? "bg-foreground text-background"
                      : "bg-lm-gray-100 text-muted-foreground"
                }`}
                aria-hidden="true"
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </span>
              <span
                className={`text-sm ${
                  done || active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
