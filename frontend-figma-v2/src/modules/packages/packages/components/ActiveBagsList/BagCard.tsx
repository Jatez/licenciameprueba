import { Calendar, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CreditBag } from "@/api/types";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { FifoIndicator } from "../shared/FifoIndicator";

interface BagCardProps {
  bag: CreditBag;
  isNextToConsume: boolean;
}

export function BagCard({ bag, isNextToConsume }: BagCardProps) {
  const s = packagesStrings.activeBags;
  const consumed = bag.creditsTotal - bag.creditsRemaining;
  const pct = Math.round((consumed / bag.creditsTotal) * 100);
  const days = Math.max(
    0,
    Math.ceil((new Date(bag.expiresAt).getTime() - Date.now()) / 86_400_000),
  );

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-semibold">{bag.packageName}</span>
            <Badge variant="vigente">{s.statusActive}</Badge>
          </div>
          {isNextToConsume ? <FifoIndicator /> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatString(s.bagRemaining, {
            remaining: formatCredits(bag.creditsRemaining),
            total: formatCredits(bag.creditsTotal),
          })}
        </p>
        <Progress value={pct} aria-label={`${pct}% consumido`} />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {days <= 60
              ? formatString(s.expiresIn, { days })
              : formatString(s.expiresOn, { date: formatDate(bag.expiresAt) })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
