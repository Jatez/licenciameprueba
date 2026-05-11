import { CreditCard, FileCheck, Sparkles, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

const sampleTrend = [12, 14, 13, 16, 18, 17, 21, 22, 24, 23, 26, 28, 30, 32];

const KPI_ANATOMY = [
  { name: "label", desc: "Texto en mayúsculas, tracking-wider, color muted." },
  { name: "value", desc: "Número grande font-bold font-tnum text-4xl/lg:[44px]." },
  { name: "delta", desc: "Pill opcional con flecha + porcentaje y sentiment color." },
  { name: "unit", desc: "Línea descriptiva text-sm muted bajo el valor." },
  { name: "sparkline / countdown", desc: "Visual h-16: AreaChart de recharts o Progress según variant." },
  { name: "ctaLabel", desc: "Link tipográfico con flecha que aparece en hover/focus." },
];

const KPI_A11Y = [
  'role="article" + aria-label autogenerado con label, valor, unidad y delta.',
  "tabIndex=0 cuando la card es clickable (sin ctaLabel + onCtaClick).",
  "El delta chip tiene aria-label que explica el cambio absoluto y porcentual.",
  "Sparkline expone role=\"img\" + aria-label \"Tendencia de {label}\".",
  "Countdown progress expone aria-valuenow / aria-valuemax para lectores de pantalla.",
];

const KPI_DOS = [
  "Reservar appearance=\"dark\" únicamente para la KPI principal (Saldo).",
  "Mantener el sparklineColor consistente por familia de métrica.",
  "Activar isHighlighted cuando hay alerta operativa (saldo bajo, bolsa expirando).",
  "Usar variant=\"countdown\" SOLO para tiempos restantes — el color del bar se calcula automáticamente.",
];

const KPI_DONTS = [
  "Mezclar variant metric y countdown en la misma card.",
  "Hardcodear delta percent sin signo — el componente decide flecha y color.",
  "Saltarse el font-tnum en valores numéricos (rompe la alineación entre cards).",
  "Usar appearance=\"dark\" en más de 1 card por fila (pierde la jerarquía).",
];

const KPI_CODE = `import { KPICard } from "@/components/ui/kpi-card";
import { CreditCard, FileCheck, Sparkles, TrendingUp } from "lucide-react";

// 1. Balance — dark hero, sparkline gradient
<KPICard
  label="Saldo de créditos"
  value={180}
  unit="créditos disponibles"
  delta={{ value: 25, percent: -12, period: "vs período anterior", sentiment: "negative" }}
  trend={trend14d}
  variant="metric"
  appearance="dark"
  fillPattern="gradient"
  icon={CreditCard}
  ctaLabel="Comprar créditos"
  onCtaClick={() => navigate("/packages")}
/>

// 2. Active licenses — light, stripes pattern
<KPICard
  label="Licencias activas"
  value={35}
  unit="licencias en vigencia"
  delta={{ value: 3, percent: 8, period: "vs período anterior", sentiment: "positive" }}
  trend={trend14d}
  variant="metric"
  fillPattern="stripes"
  icon={FileCheck}
  ctaLabel="Ver licencias"
/>

// 3. Tracked posts — light, gradient
<KPICard
  label="Publicaciones"
  value={22}
  unit="publicaciones detectadas"
  delta={{ value: 3, percent: 15, period: "vs período anterior", sentiment: "positive" }}
  trend={trend14d}
  variant="metric"
  icon={Sparkles}
  ctaLabel="Ver métricas"
/>

// 4. Bag validity — countdown
<KPICard
  label="Vigencia bolsa"
  value={270}
  unit="días restantes"
  variant="countdown"
  countdown={{ daysLeft: 270, totalDays: 365 }}
  icon={TrendingUp}
  ctaLabel="Extender bolsa"
/>`;

export function KPICardSection() {
  return (
    <>
      <DSSectionHeader
        id="kpi-card"
        title="KPI Card"
        status="stable"
        lastUpdate={TODAY}
        componentName="<KPICard />"
      />
      <DSComponentSpec
        description="Tarjeta unificada para métricas clave del dashboard. Cuatro variantes en producción (Saldo, Licencias activas, Publicaciones, Vigencia bolsa) que combinan appearance light/dark, fillPattern gradient/stripes y variant metric/countdown."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={KPI_ANATOMY} />
              <DSUsage dos={KPI_DOS} donts={KPI_DONTS} />
              <DSCollapsibleA11y items={KPI_A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "rounded-card",
                  "p-6",
                  "bg-card border-border (light)",
                  "bg-foreground text-background (dark)",
                  "text-4xl lg:text-[44px] font-bold font-tnum",
                  "text-xs font-medium uppercase tracking-wider (label)",
                  "h-16 (visual area)",
                  "[&>div]:bg-success / bg-warning / bg-destructive (countdown)",
                  "hsl(var(--foreground)) (sparkline default)",
                  "transition-all hover:shadow-md",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Las 4 variantes reales del dashboard
                    </p>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <KPICard
                        label="Saldo de créditos"
                        value={180}
                        unit="créditos disponibles"
                        delta={{ value: 25, percent: -12, period: "vs período anterior", sentiment: "negative" }}
                        trend={sampleTrend.slice().reverse()}
                        variant="metric"
                        appearance="dark"
                        fillPattern="gradient"
                        icon={CreditCard}
                        ctaLabel="Comprar créditos"
                      />
                      <KPICard
                        label="Licencias activas"
                        value={35}
                        unit="licencias en vigencia"
                        delta={{ value: 3, percent: 8, period: "vs período anterior", sentiment: "positive" }}
                        trend={sampleTrend}
                        variant="metric"
                        fillPattern="stripes"
                        icon={FileCheck}
                        ctaLabel="Ver licencias"
                      />
                      <KPICard
                        label="Publicaciones"
                        value={22}
                        unit="publicaciones detectadas"
                        delta={{ value: 3, percent: 15, period: "vs período anterior", sentiment: "positive" }}
                        trend={sampleTrend}
                        variant="metric"
                        icon={Sparkles}
                        ctaLabel="Ver métricas"
                      />
                      <KPICard
                        label="Vigencia bolsa"
                        value={270}
                        unit="días restantes"
                        variant="countdown"
                        countdown={{ daysLeft: 270, totalDays: 365 }}
                        icon={TrendingUp}
                        ctaLabel="Extender bolsa"
                      />
                    </div>
                  </div>
                </div>
              </DSVariants>

              {/*
                Local states grid — NO usamos <DSStates /> aquí porque su grid
                lg:grid-cols-5 aprieta las KPICards (son cards complejas con
                sparkline, no swatches/badges). Mantenemos la misma estética
                visual (header + tarjetitas con label) pero con un layout
                propio que respira.
              */}
              <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  States
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Default (metric)",
                      node: (
                        <KPICard
                          label="Licencias"
                          value={35}
                          unit="vigentes"
                          trend={sampleTrend}
                          variant="metric"
                          icon={FileCheck}
                          className="w-full"
                        />
                      ),
                    },
                    {
                      label: "Highlighted · saldo bajo",
                      node: (
                        <KPICard
                          label="Saldo"
                          value={12}
                          unit="créditos"
                          trend={sampleTrend.slice().reverse()}
                          variant="metric"
                          appearance="dark"
                          icon={CreditCard}
                          isHighlighted
                          className="w-full"
                        />
                      ),
                    },
                    {
                      label: "Countdown · expira pronto",
                      node: (
                        <KPICard
                          label="Vigencia"
                          value={5}
                          unit="días restantes"
                          variant="countdown"
                          countdown={{ daysLeft: 5, totalDays: 365 }}
                          icon={TrendingUp}
                          isHighlighted
                          className="w-full"
                        />
                      ),
                    },
                    {
                      label: "Loading",
                      node: <KPICard label="" value="" isLoading className="w-full" />,
                    },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-3">
                      {s.node}
                      <p className="text-xs font-semibold text-foreground text-center">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <DSCode snippet={KPI_CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
