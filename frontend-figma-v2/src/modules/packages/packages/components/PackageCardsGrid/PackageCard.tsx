import { Sparkles, Check, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CreditPackage } from "@/api/types";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  pkg: CreditPackage;
  onBuy: (pkg: CreditPackage) => void;
  isBestRatio: boolean;
  /** When true, the card behaves as a selectable option (radio-like). */
  selectable?: boolean;
  /** Selected state for `selectable` mode. */
  selected?: boolean;
  /** Optional CTA label override (e.g. "Seleccionar" / "Seleccionado"). */
  ctaLabel?: string;
}

export function PackageCard({
  pkg,
  onBuy,
  isBestRatio,
  selectable = false,
  selected = false,
  ctaLabel,
}: PackageCardProps) {
  const s = packagesStrings.packageCard;
  const headingId = `pkg-${pkg.id}`;
  const label = ctaLabel ?? s.buyCta;

  return (
    <article aria-labelledby={headingId}>
      <Card
        className={cn(
          "h-full transition-shadow hover:shadow-md",
          pkg.recommended && !selected && "border-2 border-primary",
          selectable && selected && "border-2 border-primary ring-2 ring-primary/30",
        )}
      >
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-2">
            <h2 id={headingId} className="text-xl font-semibold">
              {pkg.name}
            </h2>
            {pkg.recommended ? (
              <Badge variant="metric" className="gap-1">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {s.recommended}
              </Badge>
            ) : null}
            {isBestRatio && !pkg.recommended ? (
              <Badge variant="info" className="gap-1">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                {s.bestRatio}
              </Badge>
            ) : null}
          </div>

          <div>
            <div className="text-3xl font-bold tracking-tight">
              {formatCredits(pkg.credits)}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {s.creditsLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatString(s.validityLabel, { months: pkg.validityMonths })}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-semibold">{formatCop(pkg.priceCop)}</div>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2"
                  >
                    {formatString(s.pricePerCredit, {
                      value: formatCop(pkg.pricePerCreditCop).replace(
                        /[^\d.,]/g,
                        "",
                      ),
                    })}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {formatString(s.pricePerCreditTooltip, {
                    total: formatCop(pkg.priceCop),
                    credits: formatCredits(pkg.credits),
                    perCredit: formatCop(pkg.pricePerCreditCop),
                  })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            className="mt-auto w-full"
            onClick={() => onBuy(pkg)}
            variant={
              selectable
                ? selected
                  ? "default"
                  : "outline"
                : pkg.recommended
                  ? "default"
                  : "outline"
            }
            aria-pressed={selectable ? selected : undefined}
          >
            {selectable && selected ? (
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : null}
            {label}
          </Button>
        </CardContent>
      </Card>
    </article>
  );
}
