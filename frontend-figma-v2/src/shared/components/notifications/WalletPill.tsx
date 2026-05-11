import { Lock, AlertCircle, AlertTriangle, Wallet, type LucideIcon } from "lucide-react";

interface WalletPillProps {
  available: number;
  total: number;
}

export function WalletPill({ available, total }: WalletPillProps) {
  const pct = total > 0 ? (available / total) * 100 : 0;
  let cfg: { label: string; cls: string; Icon: LucideIcon; iconCls: string };
  if (available === 0) {
    cfg = { label: "Sin créditos", cls: "bg-error-subtle text-foreground", Icon: Lock, iconCls: "text-error" };
  } else if (pct <= 10) {
    cfg = { label: `${available} créditos · Recarga ya`, cls: "bg-error-subtle/60 text-foreground", Icon: AlertCircle, iconCls: "text-error" };
  } else if (pct <= 30) {
    cfg = { label: `${available} créditos · Saldo bajo`, cls: "bg-warning-subtle/60 text-foreground", Icon: AlertTriangle, iconCls: "text-warning" };
  } else {
    cfg = { label: `${available} créditos disponibles`, cls: "bg-bodycard-bg text-foreground", Icon: Wallet, iconCls: "text-foreground" };
  }
  const { Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-pill text-sm font-medium ${cfg.cls}`}>
      <Icon aria-hidden="true" className={`h-4 w-4 ${cfg.iconCls}`} />
      {cfg.label}
    </span>
  );
}
