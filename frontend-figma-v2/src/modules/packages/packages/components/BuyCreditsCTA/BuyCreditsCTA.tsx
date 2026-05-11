import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreditPackages } from "@/modules/packages/packages/hooks";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatCopCompact } from "@/modules/packages/packages/utils/formatCop";

interface BuyCreditsCTAProps {
  /** Smooth-scrolls to the `#packages` section in the same page. */
  onRecharge: () => void;
}

export function BuyCreditsCTA({ onRecharge }: BuyCreditsCTAProps) {
  const s = packagesStrings.walletHub.buyCta;
  const { data, isLoading } = useCreditPackages();

  const recommended =
    data?.find((p) => p.recommended) ?? data?.[1] ?? data?.[0] ?? null;

  return (
    <Card className="h-full border-transparent bg-primary text-primary-foreground">
      <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-primary-foreground">
              {s.title}
            </h2>
          </div>
          <p className="text-sm text-primary-foreground/75">{s.body}</p>

          {isLoading ? (
            <Skeleton className="h-16 w-full bg-black/10" />
          ) : recommended ? (
            <div className="rounded-lg border border-black/10 bg-black/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-primary-foreground">
                  {recommended.name}
                </span>
                <span className="inline-flex items-center rounded-full bg-primary-foreground px-2 py-0.5 text-[11px] font-medium text-primary">
                  {s.recommendedTag}
                </span>
              </div>
              <p className="mt-1 text-xs text-primary-foreground/75">
                {formatCredits(recommended.credits)} créditos ·{" "}
                {formatCopCompact(recommended.priceCop)} ·{" "}
                {recommended.validityMonths} meses
              </p>
            </div>
          ) : null}
        </div>

        <Button
          className="w-full bg-foreground text-background hover:bg-foreground/90"
          onClick={onRecharge}
          aria-describedby="fifo-explainer-hint"
        >
          {s.primary}
        </Button>
        <span id="fifo-explainer-hint" className="sr-only">
          Tus créditos se consumen FIFO: primero los de la bolsa que vence antes.
        </span>
      </CardContent>
    </Card>
  );
}
