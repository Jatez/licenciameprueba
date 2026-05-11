import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

export function ZeroMatchesState() {
  const navigate = useNavigate();
  const copy = s.spotify.zeroMatches;
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-lm-gray-100 text-foreground">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{copy.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{copy.body}</p>
      <Button className="mt-5" onClick={() => navigate("/catalog")}>
        {copy.cta}
      </Button>
    </Card>
  );
}
