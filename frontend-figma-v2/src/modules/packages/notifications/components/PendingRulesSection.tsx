import { Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { notificationsStrings } from "../strings";
import type { NotificationPendingRule } from "../types";

interface PendingRulesSectionProps {
  rules: NotificationPendingRule[];
}

export function PendingRulesSection({ rules }: PendingRulesSectionProps) {
  const t = notificationsStrings.pendingRules;

  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="border-dashed">
            <CardContent className="p-4 flex items-start gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full bg-warning-subtle/30 shrink-0"
                aria-hidden="true"
              >
                <Wrench size={16} className="text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {rule.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {rule.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
