import { Sparkles, Check, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pricingStrings } from "../strings";
import type { PricingPackage } from "../types";

const fmtCop = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

interface Props {
  pkg: PricingPackage;
  onEdit: (pkg: PricingPackage) => void;
}

export function PackageCard({ pkg, onEdit }: Props) {
  const t = pricingStrings.card;
  const highlighted = !!pkg.highlighted;

  return (
    <Card
      className={`relative flex flex-col gap-5 rounded-card p-6 ${
        highlighted ? "border-primary/40 bg-primary/5 shadow-md" : ""
      }`}
    >
      {pkg.badge && (
        <Badge variant="metric" className="absolute -top-2 right-6 gap-1">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {pkg.badge}
        </Badge>
      )}

      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Paquete
        </p>
        <h3 className="text-2xl font-semibold text-foreground">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground">{pkg.tagline}</p>
      </div>

      <div className="space-y-1">
        <p className="font-tnum text-4xl font-bold text-foreground">{fmtCop(pkg.priceCop)}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-tnum text-foreground">{pkg.credits.toLocaleString("es-CO")}</span>{" "}
          {t.creditsLabel} · {t.validityLabel(pkg.validityMonths)}
        </p>
        <p className="text-xs text-muted-foreground font-tnum">
          {fmtCop(pkg.pricePerCreditCop)} {t.perCreditLabel}
        </p>
      </div>

      <ul className="flex-1 space-y-2 border-t border-border pt-4">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-foreground">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-success"
              aria-hidden="true"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={highlighted ? "default" : "secondary"}
        className="w-full"
        onClick={() => onEdit(pkg)}
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
        {t.editCta}
      </Button>
    </Card>
  );
}
