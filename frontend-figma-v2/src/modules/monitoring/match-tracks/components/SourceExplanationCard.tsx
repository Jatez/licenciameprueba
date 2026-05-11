import { Card } from "@/components/ui/card";
import { matchTracksStrings as s } from "../strings";

export function SourceExplanationCard() {
  const c = s.social.explanation;
  const blocks = [
    { title: c.spotifyTitle, body: c.spotifyBody },
    { title: c.socialTitle, body: c.socialBody },
    { title: c.catalogTitle, body: c.catalogBody, accent: true as const },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {blocks.map((b) => (
          <div
            key={b.title}
            className={`rounded-lg border p-4 ${
              b.accent
                ? "border-primary bg-primary/10"
                : "border-border bg-background"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">{b.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{b.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
