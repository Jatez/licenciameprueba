import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  CalendarClock,
  ArrowRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DemoState = "normal" | "low_balance" | "expiring";

const DEMO_OPTIONS: Array<{ value: DemoState; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "low_balance", label: "Saldo bajo" },
  { value: "expiring", label: "Vencimiento cercano" },
];

const STRINGS = {
  sectionLabel: "Alertas de cuenta",
  demoTitle: "Vista demo",
  demoHint: "Modo demo: estado simulado para revisión del flujo.",
  emailSent: "Alerta enviada por email",
  states: {
    normal: {
      title: "Tu cuenta está al día",
      message: "No tienes alertas críticas por ahora.",
    },
    low_balance: {
      title: "Saldo bajo de créditos",
      message:
        "Tu bolsa activa está cerca de agotarse. Compra más créditos para evitar interrupciones.",
      cta: "Comprar créditos",
      route: "/packages",
    },
    expiring: {
      title: "Tu bolsa está próxima a vencer",
      message:
        "Aún tienes créditos disponibles. Úsalos antes de la fecha de vencimiento.",
      cta: "Ver wallet",
      route: "/packages",
    },
  },
} as const;

/**
 * F-12 complement: in-app demo banners for critical email-driven notifications.
 * Pure UI, no real data — selector toggles between mock states for demo.
 */
export function AccountAlertsDemo() {
  const [state, setState] = useState<DemoState>("low_balance");

  return (
    <section
      aria-label={STRINGS.sectionLabel}
      className="flex flex-col gap-3"
    >
      <DemoSelector value={state} onChange={setState} />
      <AccountAlertBanner state={state} />
      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
        <Sparkles size={12} aria-hidden="true" />
        {STRINGS.demoHint}
      </p>
    </section>
  );
}

interface DemoSelectorProps {
  value: DemoState;
  onChange: (v: DemoState) => void;
}

function DemoSelector({ value, onChange }: DemoSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {STRINGS.demoTitle}
      </span>
      <div
        role="tablist"
        aria-label={STRINGS.demoTitle}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm"
      >
        {DEMO_OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "px-3 h-7 rounded-full text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AccountAlertBannerProps {
  state: DemoState;
}

function AccountAlertBanner({ state }: AccountAlertBannerProps) {
  const navigate = useNavigate();

  if (state === "normal") {
    const s = STRINGS.states.normal;
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-success-subtle/60 bg-success-subtle/25 px-4 py-3",
          "motion-safe:animate-fade-in",
        )}
      >
        <BannerIcon tone="success" Icon={CheckCircle2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{s.title}</p>
          <p className="text-sm text-foreground/70">{s.message}</p>
        </div>
        <Badge variant="vigente" className="hidden sm:inline-flex">
          Normal
        </Badge>
      </div>
    );
  }

  const isExpiring = state === "expiring";
  const s = isExpiring ? STRINGS.states.expiring : STRINGS.states.low_balance;
  const Icon = isExpiring ? CalendarClock : AlertTriangle;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col gap-3 rounded-xl border px-4 py-3",
        "sm:flex-row sm:items-center",
        "motion-safe:animate-fade-in",
        isExpiring
          ? "border-error-subtle/50 bg-error-subtle/20"
          : "border-warning-subtle/60 bg-warning-subtle/25",
      )}
    >
      <BannerIcon tone={isExpiring ? "error" : "warning"} Icon={Icon} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{s.title}</p>
          <Badge
            variant="info"
            className="gap-1 bg-card/80 border border-border"
          >
            <Mail size={11} aria-hidden="true" />
            {STRINGS.emailSent}
          </Badge>
        </div>
        <p className="text-sm text-foreground/75 mt-0.5">{s.message}</p>
      </div>
      <Button
        size="sm"
        onClick={() => navigate(s.route)}
        className="shrink-0 self-start sm:self-center"
      >
        {s.cta}
        <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

interface BannerIconProps {
  tone: "success" | "warning" | "error";
  Icon: typeof CheckCircle2;
}

function BannerIcon({ tone, Icon }: BannerIconProps) {
  const toneClass =
    tone === "success"
      ? "bg-success-subtle/50"
      : tone === "warning"
        ? "bg-warning-subtle/60"
        : "bg-error-subtle/50";
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground",
        toneClass,
      )}
      aria-hidden="true"
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
