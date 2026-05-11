import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { matchTracksStrings as s } from "../strings";

export function MatchCriteriaExplainer() {
  const c = s.results.criteria;
  return (
    <Card className="p-6">
      <header className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 text-foreground" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
        </div>
      </header>
      <ol className="mt-4 grid gap-3 md:grid-cols-2">
        {c.items.map((item, idx) => (
          <li
            key={item.title}
            className="flex gap-3 rounded-lg border border-border bg-background p-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-foreground">
              {idx + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-lg bg-warning-subtle p-3 text-xs text-foreground">
        {c.note}
      </p>
    </Card>
  );
}
