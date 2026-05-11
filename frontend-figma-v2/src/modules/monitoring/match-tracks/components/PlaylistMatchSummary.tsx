import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

interface PlaylistMatchSummaryProps {
  analyzed: number;
  matched: number;
  partial: number;
  notAvailable: number;
  matchRate: number;
  onPrimaryAction: () => void;
}

export function PlaylistMatchSummary({
  analyzed,
  matched,
  partial,
  notAvailable,
  matchRate,
  onPrimaryAction,
}: PlaylistMatchSummaryProps) {
  const copy = s.spotify.summary;
  const isLow = matchRate < 50;
  const message = isLow ? copy.lowMessage : copy.highMessage;
  const cta = isLow ? copy.lowCta : copy.highCta;

  const stats = [
    { label: copy.analyzed, value: analyzed },
    { label: copy.matched, value: matched, tone: "success" as const },
    { label: copy.partial, value: partial, tone: "warning" as const },
    { label: copy.notAvailable, value: notAvailable, tone: "error" as const },
  ];

  return (
    <Card className="p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{copy.matchRate}</p>
          <p
            className={`text-2xl font-semibold tabular-nums ${
              isLow ? "text-error" : "text-foreground"
            }`}
          >
            {matchRate}%
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-background p-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p
              className={`mt-1 text-xl font-semibold tabular-nums ${
                stat.tone === "success"
                  ? "text-success"
                  : stat.tone === "warning"
                    ? "text-foreground"
                    : stat.tone === "error"
                      ? "text-error"
                      : "text-foreground"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-lm-gray-100 p-4">
        <p className="text-sm text-foreground">{message}</p>
        <Button onClick={onPrimaryAction}>{cta}</Button>
      </div>
    </Card>
  );
}
