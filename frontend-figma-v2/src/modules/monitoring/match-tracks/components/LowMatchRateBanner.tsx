import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

interface LowMatchRateBannerProps {
  matchRate: number;
  onViewMissing: () => void;
}

export function LowMatchRateBanner({ matchRate, onViewMissing }: LowMatchRateBannerProps) {
  const navigate = useNavigate();
  const c = s.results.lowBanner;
  return (
    <Card className="flex flex-wrap items-start gap-4 border-warning bg-warning-subtle p-5">
      <AlertTriangle className="mt-0.5 h-6 w-6 text-foreground" aria-hidden="true" />
      <div className="flex-1 min-w-[16rem]">
        <p className="text-sm font-semibold text-foreground">
          {c.title} · {matchRate}%
        </p>
        <p className="mt-1 text-xs text-foreground/80">{c.body}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onViewMissing}>
          {c.viewMissing}
        </Button>
        <Button size="sm" onClick={() => navigate("/catalog")}>
          {c.explore}
        </Button>
      </div>
    </Card>
  );
}
