import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletAggregate } from "@/modules/packages/packages/hooks";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { BagCard } from "./BagCard";

export function ActiveBagsList() {
  const s = packagesStrings.activeBags;
  const { data, isLoading } = useWalletAggregate();

  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data || data.bags.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-1 p-6 text-center">
          <p className="font-medium">{s.emptyTitle}</p>
          <p className="text-sm text-muted-foreground">{s.emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {data.bags.map((bag, idx) => (
        <BagCard key={bag.id} bag={bag} isNextToConsume={idx === 0} />
      ))}
    </div>
  );
}
