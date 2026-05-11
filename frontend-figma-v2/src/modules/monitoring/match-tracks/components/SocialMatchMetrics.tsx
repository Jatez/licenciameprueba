import { Card } from "@/components/ui/card";
import { socialMetrics } from "../mocks.social";
import { matchTracksStrings as s } from "../strings";

export function SocialMatchMetrics() {
  return (
    <section aria-label={s.social.metricsTitle} className="space-y-3">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{s.social.metricsTitle}</h3>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {socialMetrics.map((m) => (
          <Card
            key={m.key}
            className={`p-4 ${m.highlight ? "border-warning bg-warning-subtle" : ""}`}
          >
            <p className="text-xs text-muted-foreground">{s.social.metrics[m.key]}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {m.value}
            </p>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{s.social.risksHelper}</p>
    </section>
  );
}
