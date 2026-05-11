import { KPICard } from "@/components/ui/kpi-card";
import { matchHubMetrics } from "../mocks";
import { matchTracksStrings } from "../strings";

export function MatchMetricsGrid() {
  return (
    <section
      aria-label="Métricas de match"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {matchHubMetrics.map((m) => {
        const copy = matchTracksStrings.hub.metrics[m.key];
        const helper = "helper" in copy ? copy.helper : undefined;
        return (
          <KPICard
            key={m.key}
            label={copy.label}
            value={m.value}
            unit={m.unit}
            trend={m.trend}
            delta={
              m.delta
                ? {
                    value: m.delta.value,
                    percent: m.delta.percent,
                    period: "vs período anterior",
                    sentiment: m.delta.sentiment,
                  }
                : undefined
            }
            ariaLabel={`${copy.label}: ${m.value}${m.unit ?? ""}${helper ? `. ${helper}` : ""}`}
          />
        );
      })}
    </section>
  );
}
