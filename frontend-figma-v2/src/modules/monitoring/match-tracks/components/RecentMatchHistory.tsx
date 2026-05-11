import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { recentAnalyses } from "../mocks";
import { matchTracksStrings } from "../strings";
import { MatchSourceBadge } from "./MatchSourceBadge";

const formatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function RecentMatchHistory() {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {matchTracksStrings.hub.recent.title}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => navigate("/match-tracks/results")}>
          Ver todo
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </header>

      {recentAnalyses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">{matchTracksStrings.hub.recent.empty}</p>
          <Button className="mt-3" onClick={() => navigate("/match-tracks/spotify")}>
            {matchTracksStrings.hub.recent.emptyCta}
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {recentAnalyses.map((item) => {
            const lowMatch = item.matchRate < 35;
            return (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <MatchSourceBadge source={item.source} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle} · {formatter.format(new Date(item.createdAt))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {item.matchedTracks}/{item.totalTracks}
                    </p>
                    <p className={`text-xs ${lowMatch ? "text-error" : "text-muted-foreground"}`}>
                      {item.matchRate}% match
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/match-tracks/results?analysis=${item.id}`)}
                  >
                    Ver
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
