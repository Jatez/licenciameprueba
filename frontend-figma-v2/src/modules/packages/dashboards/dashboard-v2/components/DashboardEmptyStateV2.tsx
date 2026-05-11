import { useNavigate } from "react-router-dom";
import { CreditCard, Library, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardV2Strings, fmt } from "../strings";

interface DashboardEmptyStateV2Props {
  companyName: string;
}

export function DashboardEmptyStateV2({ companyName }: DashboardEmptyStateV2Props) {
  const navigate = useNavigate();
  const t = dashboardV2Strings.emptyDashboard;

  const steps = [
    { key: "buyCredits", icon: CreditCard, route: "/packages", primary: true, ...t.steps.buyCredits },
    { key: "exploreCatalog", icon: Library, route: "/catalog", primary: false, ...t.steps.exploreCatalog },
    { key: "connectSocial", icon: Link2, route: "/social-accounts", primary: false, ...t.steps.connectSocial },
  ];

  return (
    <section className="flex flex-col items-center gap-8 py-8 text-center">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{fmt(t.greeting, { companyName })}</p>
        <h1 className="text-2xl font-semibold text-foreground lg:text-3xl">{t.title}</h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.key} className="flex flex-col items-start gap-3 p-6 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-metric-subtle/[0.63]">
                <Icon className="h-5 w-5 text-metric" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">{step.title}</h2>
              <p className="flex-1 text-xs text-muted-foreground">{step.description}</p>
              <Button
                size="sm"
                variant={step.primary ? "default" : "outline"}
                className="w-full"
                onClick={() => navigate(step.route)}
              >
                {step.cta}
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
