import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import { DSComponentSpec } from "../../components/spec";

const TODAY = "2026-05-04";

const TOKENS = [
  { name: "primary", cls: "bg-primary", swatch: "bg-primary", usage: "Solo CTAs y acentos. Nunca como estado semántico." },
  { name: "success-subtle", cls: "bg-success-subtle", swatch: "bg-success-subtle", usage: "Confirmaciones, licencia emitida, pago exitoso." },
  { name: "info-subtle", cls: "bg-info-subtle", swatch: "bg-info-subtle", usage: "MFA, sesión por expirar, avisos preventivos." },
  { name: "warning-subtle", cls: "bg-warning-subtle", swatch: "bg-warning-subtle", usage: "Saldo bajo, paquete por vencer, atención requerida." },
  { name: "error-subtle", cls: "bg-error-subtle", swatch: "bg-error-subtle", usage: "Pago rechazado, sin créditos, bolsa vencida." },
  { name: "consumida-subtle", cls: "bg-consumida-subtle", swatch: "bg-consumida-subtle", usage: "Estados consumidos / completados (no error, no éxito vivo)." },
  { name: "muted / foreground", cls: "bg-muted", swatch: "bg-muted", usage: "Texto secundario, fondos neutros, estados expirados." },
  { name: "lm-black / white", cls: "bg-lm-black text-white", swatch: "bg-lm-black", usage: "CTA primario en cualquier notificación." },
];

export function NotifTokensSection() {
  return (
    <>
      <DSSectionHeader
        id="notif-tokens"
        title="Tokens semánticos de feedback"
        status="stable"
        lastUpdate={TODAY}
      />
      <DSComponentSpec
        description="Tokens del DS que rigen el sistema de feedback (toasts, banners, modals, pills, badges). Cero HEX en JSX — todo se consume desde estos tokens. El brand lima (#DBEC62) NO es un estado semántico; vive solo en CTAs y acentos."
        layout="split"
      >
        <DSSectionBody layout="foundation">
          <div className="rounded-card border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Color</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Token</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Clase Tailwind</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Uso</th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((t) => (
                  <tr key={t.name} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className={`h-8 w-8 rounded-md border border-border ${t.swatch}`} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{t.cls}</code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{t.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-card border border-warning-subtle bg-warning-subtle/30 p-4 text-sm text-foreground">
            <strong>Regla dura:</strong> el brand lima nunca indica estado semántico (no es warning, aunque visualmente se parezca). Si el producto usa un color/copy/superficie distinto al documentado aquí, es un bug.
          </div>
        </DSSectionBody>
      </DSComponentSpec>
    </>
  );
}