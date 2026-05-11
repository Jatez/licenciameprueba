import { Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { catalogStrings } from "@/modules/tracks/strings";

export function TrackRemovedState() {
  const navigate = useNavigate();
  const s = catalogStrings.trackDetailStates.removed;
  return (
    <section
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-card border border-border bg-surface p-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Archive className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">{s.title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{s.description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => navigate("/catalog")}>{s.ctaPrimary}</Button>
        <Button
          variant="outline"
          onClick={() => navigate("/catalog?sort=popularity-desc")}
        >
          {s.ctaSecondary}
        </Button>
      </div>
    </section>
  );
}
