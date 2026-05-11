import { CircleDashed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STRINGS = {
  title: "Huecos pendientes de definición",
  subtitle:
    "Decisiones técnicas y de producto que deben confirmarse antes de implementación real.",
  status: {
    pending: "Pendiente",
    needsDefinition: "Requiere definición en kickoff técnico",
  },
  items: [
    {
      id: "low_balance_threshold",
      label: "Definir umbral de saldo bajo",
    },
    {
      id: "expiry_anticipation_days",
      label: "Definir días de anticipación para vencimiento",
    },
    {
      id: "in_app_banners",
      label: "Confirmar si se agregan banners in-app como complemento al email",
    },
  ],
} as const;

export function PendingDefinitionsChecklist() {
  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">{STRINGS.title}</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {STRINGS.subtitle}
        </p>
      </header>

      <Card>
        <CardContent className="p-2 sm:p-3">
          <ul className="divide-y divide-border">
            {STRINGS.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CircleDashed
                    size={18}
                    className="text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <Badge variant="pendiente">{STRINGS.status.pending}</Badge>
                  <Badge variant="info">{STRINGS.status.needsDefinition}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
