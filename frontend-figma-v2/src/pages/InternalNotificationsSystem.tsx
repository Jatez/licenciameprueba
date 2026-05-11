import { useEffect, useState } from "react";
import { Banner } from "@/shared/components/notifications/Banner";
import { Modal } from "@/shared/components/notifications/Modal";
import { WalletPill } from "@/shared/components/notifications/WalletPill";
import { BolsaPill } from "@/shared/components/notifications/BolsaPill";
import { LicenseBadge } from "@/shared/components/notifications/LicenseBadge";
import { ColorSwatch } from "@/shared/components/notifications/ColorSwatch";
import { SectionBlock } from "@/shared/components/notifications/SectionBlock";
import { ToastViewport } from "@/shared/components/notifications/Toast";
import { useNotifToastStore } from "@/features/internal-notifications/toastStore";
import { SOW_NOTIFS, OPS_NOTIFS, NAV_SECTIONS } from "@/features/internal-notifications/sections";
import { InternalSidebar } from "@/features/internal-notifications/parts/Sidebar";
import { NotifCard } from "@/features/internal-notifications/parts/NotifCard";

const TOKENS = [
  { name: "primary", tokenClass: "bg-primary", swatchClass: "bg-primary", usage: "Solo CTAs y acentos. JAMÁS para indicar estado." },
  { name: "success-subtle", tokenClass: "bg-success-subtle", swatchClass: "bg-success-subtle", usage: "Confirmaciones positivas: compra OK, licencia emitida, reporte listo." },
  { name: "info-subtle", tokenClass: "bg-info-subtle", swatchClass: "bg-info-subtle", usage: "Información neutra accionable: MFA, sesión por expirar, avisos preventivos." },
  { name: "warning-subtle", tokenClass: "bg-warning-subtle", swatchClass: "bg-warning-subtle", usage: "Atención sin bloqueo: saldo bajo, token expirado, bolsa por vencer." },
  { name: "error-subtle", tokenClass: "bg-error-subtle", swatchClass: "bg-error-subtle", usage: "Errores y bloqueos: pago rechazado, sin créditos, bolsa vencida." },
  { name: "muted / foreground", tokenClass: "bg-muted · text-foreground", swatchClass: "bg-muted", usage: "Texto, fondos y estados inactivos / expirados sin urgencia." },
];

const SURFACES = [
  { name: "Toast", duration: "Auto-dismiss 4s", when: "Confirmaciones, feedback rápido" },
  { name: "Banner", duration: "Persistente hasta resolver", when: "Saldo bajo, OAuth expirado, bolsa por vencer" },
  { name: "Modal", duration: "Bloqueante hasta interacción", when: "Pago rechazado, MFA, errores críticos" },
  { name: "Inline", duration: "En contexto de flujo", when: "Validaciones de formulario, créditos insuficientes" },
  { name: "Badge / Pill", duration: "Permanente en UI", when: "Estados de licencia, estado de saldo" },
];

const RULES = [
  "Agrupar alertas simultáneas: si hay saldo bajo + bolsa por vencer al tiempo, mostrar un solo banner con el caso más crítico.",
  "Anti-spam: máximo 1 email por evento por día.",
  "Banners persistentes no se cierran con X — se cierran solos cuando se resuelve el problema.",
  "Toasts auto-dismiss a 4 segundos.",
  "Modales bloqueantes solo para: pago rechazado, MFA, errores que impiden continuar.",
  "Badges de estado son siempre legibles a primera vista (cumplir WCAG AA — contraste mínimo 4.5:1).",
];

const OPEN_QUESTIONS = [
  "¿Umbral de «saldo bajo» por % del paquete (propuesto) o cantidad fija?",
  "¿Días de anticipación de vencimiento: 30/15/7/1 o el cliente prefiere otra escala?",
  "¿Canal in-app confirmado además de email?",
  "¿Color brand (lima) confirmado solo para CTAs y nunca para warning?",
];

export default function InternalNotificationsSystem() {
  const [active, setActive] = useState<string>(NAV_SECTIONS[0].id);
  const [credits, setCredits] = useState(75);
  const [days, setDays] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const show = useNotifToastStore((s) => s.show);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const today = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-bodycard-bg scroll-smooth">
      <header className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Documentación interna</p>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Notificaciones</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Fuente única de verdad para el lenguaje de feedback al usuario en Licénciame: tokens, superficies, eventos del SOW, estados de wallet/bolsa y badges de licencia.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-8">
        <InternalSidebar active={active} />

        <main className="flex-1 min-w-0">
          <SectionBlock id="intro" title="1. Introducción">
            <div className="rounded-lg border border-border bg-surface p-5 text-sm text-foreground space-y-2">
              <p>Esta página documenta todo el lenguaje de feedback al usuario en Licénciame.</p>
              <p>Hay <strong>5 notificaciones contractuales del SOW</strong> (fijas, no configurables) y <strong>7 operacionales</strong> (recomendadas, in-app únicamente).</p>
              <p>El canal contractual es <strong>email</strong>; el complemento es <strong>in-app</strong>.</p>
            </div>
          </SectionBlock>

          <SectionBlock id="tokens" title="2. Tokens semánticos del Design System" description="Todos los colores provienen del DS (src/index.css + tailwind.config.ts). Cero HEX hardcoded.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOKENS.map((t) => <ColorSwatch key={t.name} {...t} />)}
            </div>
          </SectionBlock>

          <SectionBlock id="surfaces" title="3. Superficies" description="Tipos de contenedor para mostrar feedback.">
            <div className="rounded-lg border border-border bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-bodycard-bg text-muted-foreground text-xs uppercase">
                  <tr><th className="text-left p-3">Superficie</th><th className="text-left p-3">Duración</th><th className="text-left p-3">Cuándo usar</th></tr>
                </thead>
                <tbody>
                  {SURFACES.map((s) => (
                    <tr key={s.name} className="border-t border-border">
                      <td className="p-3 font-semibold text-foreground">{s.name}</td>
                      <td className="p-3 text-muted-foreground">{s.duration}</td>
                      <td className="p-3 text-foreground">{s.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Toasts (outlined)</p>
                <div className="flex flex-wrap gap-2">
                  {(["success","info","warning","error"] as const).map((t) => (
                    <button key={t} onClick={() => show({ type: t, message: `Toast de prueba: ${t}` })}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-lm-black text-white hover:bg-lm-black/90">
                      Probar {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Modal</p>
                <button onClick={() => setModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-lm-black text-white hover:bg-lm-black/90">
                  Abrir modal
                </button>
              </div>

              <div className="lg:col-span-2 space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Banner — filled (default)</p>
                <Banner
                  tone="warning"
                  title="Tu bolsa está por vencer"
                  message="Tu bolsa actual vence en 45 días. Quedan 180 créditos sin usar."
                  primaryCta={{ label: "Comprar créditos" }}
                />
              </div>
              <div className="lg:col-span-2 space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Banner — outlined</p>
                <Banner
                  variant="outlined"
                  tone="info"
                  title="Sesión por expirar"
                  message="Tu sesión expira en 5 minutos. Guarda tus cambios."
                  primaryCta={{ label: "Renovar sesión" }}
                  secondaryCta={{ label: "Cerrar sesión" }}
                />
              </div>
              <div className="lg:col-span-2 space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Inline</p>
                <div className="rounded-md border border-error-subtle bg-error-subtle/30 text-foreground px-3 py-2 text-sm">
                  Necesitas 50 créditos. Tienes 12.
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock id="sow" title="4. Notificaciones del SOW" description="Las 5 notificaciones contractuales fijas. Canal email + complemento in-app.">
            <div className="space-y-2">{SOW_NOTIFS.map((n) => <NotifCard key={n.num} n={n} />)}</div>
          </SectionBlock>

          <SectionBlock id="ops" title="5. Notificaciones operacionales" description="7 notificaciones recomendadas, in-app únicamente.">
            <div className="space-y-2">{OPS_NOTIFS.map((n) => <NotifCard key={n.num} n={n} />)}</div>
          </SectionBlock>

          <SectionBlock id="wallet" title="6. Estados de Wallet" description="Pill de saldo. Mueve el slider para ver los 4 estados en vivo.">
            <div className="flex flex-wrap gap-3">
              <WalletPill available={75} total={100} />
              <WalletPill available={20} total={100} />
              <WalletPill available={5} total={100} />
              <WalletPill available={0} total={100} />
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <label className="text-xs uppercase tracking-wide text-muted-foreground block mb-2">
                Créditos: {credits} / 100
              </label>
              <input type="range" min={0} max={100} value={credits} onChange={(e) => setCredits(Number(e.target.value))} className="w-full mb-3" />
              <WalletPill available={credits} total={100} />
            </div>
          </SectionBlock>

          <SectionBlock id="bolsa" title="7. Estados de Bolsa" description="Pill de vigencia. Cambia los días restantes para ver los 6 estados.">
            <div className="flex flex-wrap gap-3">
              {[60, 30, 12, 5, 1, 0].map((d) => <BolsaPill key={d} daysLeft={d} />)}
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <label className="text-xs uppercase tracking-wide text-muted-foreground block mb-2">
                Días restantes
              </label>
              <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-32 px-3 py-1.5 border border-border rounded-md bg-surface mb-3" />
              <div><BolsaPill daysLeft={days} /></div>
            </div>
          </SectionBlock>

          <SectionBlock id="license" title="8. Badges de estado de licencia" description="Los 4 estados del SOW.">
            <div className="flex flex-wrap gap-3">
              <LicenseBadge status="vigente" />
              <LicenseBadge status="consumida" />
              <LicenseBadge status="expirada" />
              <LicenseBadge status="anulada" />
            </div>
          </SectionBlock>

          <SectionBlock id="rules" title="9. Reglas de comportamiento del sistema">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RULES.map((r, i) => (
                <li key={i} className="rounded-lg border border-border bg-surface p-4 text-sm text-foreground">
                  {r}
                </li>
              ))}
            </ul>
          </SectionBlock>

          <SectionBlock id="open" title="10. Preguntas abiertas — pendientes con cliente">
            <div className="rounded-lg bg-warning-subtle/30 border border-warning-subtle p-5">
              <ul className="space-y-2 text-sm text-foreground">
                {OPEN_QUESTIONS.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionBlock>

          <footer className="py-6 text-center text-xs text-muted-foreground">
            Última actualización: {today} · Licénciame internal · No distribuir
          </footer>
        </main>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Pago rechazado"
        primaryCta={{ label: "Reintentar", onClick: () => setModalOpen(false) }}
        secondaryCta={{ label: "Cancelar", onClick: () => setModalOpen(false) }}
      >
        No pudimos procesar tu pago. Intenta con otro método.
      </Modal>

      <ToastViewport />
    </div>
  );
}
