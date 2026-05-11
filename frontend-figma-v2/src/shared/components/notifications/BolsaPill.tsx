interface BolsaPillProps {
  daysLeft: number;
}

export function BolsaPill({ daysLeft }: BolsaPillProps) {
  let cfg: { label: string; cls: string; strike?: boolean };
  if (daysLeft <= 0) {
    cfg = { label: "Bolsa vencida", cls: "bg-error-subtle text-foreground", strike: true };
  } else if (daysLeft === 1) {
    cfg = { label: "Vence hoy", cls: "bg-error-subtle text-foreground" };
  } else if (daysLeft <= 7) {
    cfg = { label: `Vence en ${daysLeft} días`, cls: "bg-error-subtle/50 text-foreground" };
  } else if (daysLeft <= 15) {
    cfg = { label: `Vence en ${daysLeft} días`, cls: "bg-warning-subtle/60 text-foreground" };
  } else if (daysLeft <= 30) {
    cfg = { label: `Vence en ${daysLeft} días`, cls: "bg-info-subtle/40 text-foreground" };
  } else {
    cfg = { label: `Vence en ${daysLeft} días`, cls: "bg-bodycard-bg text-foreground" };
  }
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-pill text-sm font-medium ${cfg.cls} ${cfg.strike ? "line-through" : ""}`}>
      {cfg.label}
    </span>
  );
}
