import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  USER_ACTIVITY_CATEGORY_LABELS,
  USER_ACTIVITY_CATEGORY_ORDER,
  USER_ACTIVITY_TYPES,
  type UserActivityCategory,
} from "@/shared/constants/activityTypes";
import type { UserActivityType } from "@/api/types.dashboard";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";

const STRINGS = {
  back: "Volver a Actividad",
  title: "Tipos de actividad",
  lead:
    "Aquí registramos cada acción que tú o tu equipo realiza en Licénciame. Las detecciones automáticas en redes sociales y las alertas del sistema se manejan en Monitoreo y Notificaciones.",
  countSingular: "{count} tipo",
  countPlural: "{count} tipos",
  callout: {
    title: "¿Buscas otros eventos?",
    body:
      "Las detecciones automáticas como matches de publicaciones o cambios de estado en redes sociales viven en Monitoreo. Las alertas de saldo bajo o vencimiento de bolsa están en Notificaciones.",
    monitoring: "Ir a Monitoreo →",
    notifications: "Ir a Notificaciones →",
  },
  breadcrumb: { dashboard: "Dashboard", activity: "Actividad", here: "¿Qué se registra aquí?" },
};

function typesByCategory(): Record<UserActivityCategory, UserActivityType[]> {
  const groups: Record<UserActivityCategory, UserActivityType[]> = {
    licenses: [],
    credits: [],
    connections: [],
    catalog: [],
    reports: [],
    company: [],
  };
  for (const [type, cfg] of Object.entries(USER_ACTIVITY_TYPES) as [
    UserActivityType,
    (typeof USER_ACTIVITY_TYPES)[UserActivityType],
  ][]) {
    groups[cfg.category].push(type);
  }
  return groups;
}

function formatTypeCount(n: number): string {
  return (n === 1 ? STRINGS.countSingular : STRINGS.countPlural).replace("{count}", String(n));
}

export function ActivityHistoryPage() {
  const groups = typesByCategory();

  return (
    <div className="flex w-full flex-col gap-6">
      <AppPageHeader
        title={STRINGS.title}
        description={STRINGS.lead}
        liftStickyDesktop
        primaryAction={{
          label: STRINGS.back,
          icon: <ArrowLeft className="h-4 w-4" aria-hidden="true" />,
          onClick: () => window.history.back(),
          "aria-label": "Volver a la página de Actividad",
        }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard03" className="hover:text-foreground hover:underline">
          {STRINGS.breadcrumb.dashboard}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link to="/activity" className="hover:text-foreground hover:underline">
          {STRINGS.breadcrumb.activity}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-foreground">{STRINGS.breadcrumb.here}</span>
      </nav>

      {/* Categorías */}
      <div className="flex flex-col gap-8">
        {USER_ACTIVITY_CATEGORY_ORDER.map((category) => {
          const types = groups[category];
          if (!types.length) return null;
          return (
            <section
              key={category}
              aria-labelledby={`activity-cat-${category}`}
              className="flex flex-col gap-3"
            >
              <header className="flex items-baseline justify-between">
                <h2
                  id={`activity-cat-${category}`}
                  className="text-lg font-semibold text-foreground"
                >
                  {USER_ACTIVITY_CATEGORY_LABELS[category]}
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                    · {formatTypeCount(types.length)}
                  </span>
                </h2>
              </header>
              <ul className="flex flex-col rounded-card border border-border bg-card">
                {types.map((type, idx) => {
                  const cfg = USER_ACTIVITY_TYPES[type];
                  const Icon = cfg.icon;
                  return (
                    <li
                      key={type}
                      className={cn(
                        "flex items-start gap-3 px-4 py-4",
                        idx < types.length - 1 && "border-b border-muted/40",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          cfg.bgClass,
                        )}
                        aria-hidden="true"
                      >
                        <Icon className={cn("h-5 w-5", cfg.textClass)} />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h3 className="text-sm font-medium text-foreground">{cfg.title}</h3>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {cfg.helpText}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Callout final */}
      <aside className="flex flex-col gap-3 rounded-lg bg-muted/30 p-5">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground"
            aria-hidden="true"
          >
            <Info className="h-4 w-4" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-foreground">{STRINGS.callout.title}</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">{STRINGS.callout.body}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pl-12">
          <Button asChild size="sm" variant="outline">
            <Link to="/monitoring">{STRINGS.callout.monitoring}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/notifications">{STRINGS.callout.notifications}</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}