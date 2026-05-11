import { useState } from "react";
import {
  MailX,
  Globe2,
  Users,
  Layers,
  AlertTriangle,
  CalendarClock,
  FileCheck,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const STRINGS = {
  section: {
    title: "Estados especiales",
    subtitle:
      "Edge cases y escenarios límite del flujo de notificaciones que requieren visibilidad para la conversación con cliente.",
  },
  cards: {
    undelivered: {
      title: "Email no entregado",
      description:
        "No se pudo confirmar la entrega de una notificación crítica.",
      status: "Error simulado",
      microcopy: "No existe canal alternativo definido en el SOW.",
      cta: "Ver recomendación",
      modalTitle: "Recomendación UX",
      modalBody:
        "Considerar una alerta in-app como complemento al email para eventos críticos (saldo bajo, vencimiento de bolsa, licencia emitida). El SOW actual no contempla canal alternativo (SMS, push o webhook).",
    },
    domain: {
      title: "Email corporativo posiblemente desactualizado",
      description:
        "La empresa pudo cambiar de dominio y el email registrado ya no existe.",
      status: "Riesgo operativo",
      cta: "Solicitar actualización de email",
    },
    shared: {
      title: "Cuenta compartida",
      description:
        "Todas las notificaciones se envían al mismo email registrado de la empresa.",
      status: "Limitación actual",
      microcopy: "Actualmente no existen destinatarios configurables por usuario.",
      detailsLabel: "Comportamiento actual",
      details: [
        "Un único email destinatario por cuenta empresa",
        "Sin reenvío automático a otros usuarios internos",
        "Sin segmentación por rol (Brand Manager, Admin, etc.)",
      ],
    },
    multiple: {
      title: "Alertas simultáneas",
      description:
        "Cuando ocurren varios eventos críticos, se recomienda agrupar o priorizar las notificaciones.",
      status: "Recomendación UX",
      exampleLabel: "Ejemplo visual",
      examples: [
        { label: "Saldo bajo", icon: AlertTriangle, tone: "warning" as const },
        { label: "Bolsa próxima a vencer", icon: CalendarClock, tone: "error" as const },
        { label: "Licencia emitida", icon: FileCheck, tone: "success" as const },
      ],
    },
  },
} as const;

const STATUS_VARIANT = {
  error: "expirada",
  risk: "pendiente",
  limitation: "consumida",
  recommendation: "info",
} as const;

export function SpecialStatesSection() {
  const [recOpen, setRecOpen] = useState(false);
  const t = STRINGS;

  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">{t.section.title}</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {t.section.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Undelivered */}
        <SpecialStateCard
          icon={MailX}
          tone="error"
          title={t.cards.undelivered.title}
          description={t.cards.undelivered.description}
          status={t.cards.undelivered.status}
          statusVariant={STATUS_VARIANT.error}
          microcopy={t.cards.undelivered.microcopy}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRecOpen(true)}
            >
              {t.cards.undelivered.cta}
            </Button>
          }
        />

        {/* 2. Domain changed */}
        <SpecialStateCard
          icon={Globe2}
          tone="warning"
          title={t.cards.domain.title}
          description={t.cards.domain.description}
          status={t.cards.domain.status}
          statusVariant={STATUS_VARIANT.risk}
          action={
            <Button
              variant="secondary"
              size="sm"
              disabled
              aria-disabled="true"
              title="Acción no funcional · sólo demo"
            >
              {t.cards.domain.cta}
            </Button>
          }
        />

        {/* 3. Shared account */}
        <SpecialStateCard
          icon={Users}
          tone="muted"
          title={t.cards.shared.title}
          description={t.cards.shared.description}
          status={t.cards.shared.status}
          statusVariant={STATUS_VARIANT.limitation}
          microcopy={t.cards.shared.microcopy}
        >
          <div className="mt-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              {t.cards.shared.detailsLabel}
            </p>
            <ul className="flex flex-col gap-1.5">
              {t.cards.shared.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span
                    className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0"
                    aria-hidden="true"
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </SpecialStateCard>

        {/* 4. Multiple alerts */}
        <SpecialStateCard
          icon={Layers}
          tone="info"
          title={t.cards.multiple.title}
          description={t.cards.multiple.description}
          status={t.cards.multiple.status}
          statusVariant={STATUS_VARIANT.recommendation}
        >
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              {t.cards.multiple.exampleLabel}
            </p>
            <div className="flex flex-col gap-1.5">
              {t.cards.multiple.examples.map((ex) => (
                <ExampleRow key={ex.label} icon={ex.icon} tone={ex.tone} label={ex.label} />
              ))}
            </div>
          </div>
        </SpecialStateCard>
      </div>

      <Dialog open={recOpen} onOpenChange={setRecOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.cards.undelivered.modalTitle}</DialogTitle>
            <DialogDescription className="pt-2 text-foreground/80">
              {t.cards.undelivered.modalBody}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setRecOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

type Tone = "error" | "warning" | "info" | "muted" | "success";

interface SpecialStateCardProps {
  icon: typeof MailX;
  tone: Tone;
  title: string;
  description: string;
  status: string;
  statusVariant: "expirada" | "pendiente" | "consumida" | "info";
  microcopy?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

function SpecialStateCard({
  icon: Icon,
  tone,
  title,
  description,
  status,
  statusVariant,
  microcopy,
  action,
  children,
}: SpecialStateCardProps) {
  const iconBg = toneToBg(tone);

  return (
    <Card className="h-full">
      <CardContent className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${iconBg}`}
            aria-hidden="true"
          >
            <Icon size={18} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <Badge variant={statusVariant}>{status}</Badge>
            </div>
            <p className="text-sm text-foreground/80 mt-1">{description}</p>
          </div>
        </div>

        {children}

        {microcopy && (
          <p className="text-xs text-muted-foreground bg-muted/40 border border-border rounded-md px-2.5 py-2">
            {microcopy}
          </p>
        )}

        {action && <div className="mt-auto pt-1">{action}</div>}
      </CardContent>
    </Card>
  );
}

function ExampleRow({
  icon: Icon,
  tone,
  label,
}: {
  icon: typeof AlertTriangle;
  tone: Tone;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-1.5">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${toneToBg(tone)}`}
        aria-hidden="true"
      >
        <Icon size={12} className="text-foreground" />
      </div>
      <span className="text-sm text-foreground">{label}</span>
      <Circle
        size={6}
        className="ml-auto fill-foreground/30 text-foreground/30"
        aria-hidden="true"
      />
    </div>
  );
}

function toneToBg(tone: Tone): string {
  switch (tone) {
    case "error":
      return "bg-error-subtle/40";
    case "warning":
      return "bg-warning-subtle/50";
    case "info":
      return "bg-info-subtle/30";
    case "success":
      return "bg-success-subtle/50";
    case "muted":
    default:
      return "bg-muted";
  }
}
