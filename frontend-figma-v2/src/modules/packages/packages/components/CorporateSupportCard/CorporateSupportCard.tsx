import { Headset, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { packagesStrings } from "@/modules/packages/packages/strings";

interface Props {
  className?: string;
}

/**
 * Soft outline card pointing the user to corporate accounts support.
 * Render conditionally from the detail page when amount is high or when
 * the order is in a non-self-serve state (manual_review/rejected/pending_confirmation).
 */
export function CorporateSupportCard({ className }: Props) {
  const s = packagesStrings.support.corporate;
  return (
    <Card
      className={`border-metric/40 bg-metric-subtle/20 ${className ?? ""}`}
    >
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start gap-3">
          <Headset className="mt-0.5 h-5 w-5 text-foreground" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.body}</p>
          </div>
        </div>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <a
              href={`mailto:${s.email}`}
              className="text-foreground hover:underline"
            >
              {s.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" aria-hidden="true" />
            <a
              href={`tel:${s.phone.replace(/\s/g, "")}`}
              className="text-foreground hover:underline"
            >
              {s.phone}
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{s.hours}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="sm" variant="outline">
            <a href={`mailto:${s.email}`}>
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              {s.ctaEmail}
            </a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a href={`tel:${s.phone.replace(/\s/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              {s.ctaPhone}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
