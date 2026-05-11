import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { packagesStrings } from "@/modules/packages/packages/strings";

export function NoPurchasesYet() {
  const s = packagesStrings.history.empty;
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <h3 className="text-lg font-semibold">{s.title}</h3>
        <p className="text-sm text-muted-foreground">{s.description}</p>
        <Button asChild>
          <Link to="/packages">{s.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
