import { cn } from "@/lib/utils";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  current: number;
  consumed: number;
  resulting: number;
}

export function SummaryBalanceBlock({ current, consumed, resulting }: Props) {
  const t = licensingStrings.step3;
  const isZero = resulting === 0;

  const Row = ({
    label,
    value,
    emphasis,
  }: {
    label: string;
    value: string;
    emphasis?: "warning" | "default";
  }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          emphasis === "warning" ? "text-warning" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );

  return (
    <section
      aria-label={t.sections.balance}
      className="rounded-xl border border-border bg-card p-4"
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.sections.balance}
      </h3>
      <div className="space-y-2">
        <Row label={t.balance.current} value={`${current}`} />
        <Row label={t.balance.consumed} value={`− ${consumed}`} />
        <div className="my-2 border-t border-border" />
        <Row
          label={t.balance.resulting}
          value={`${resulting}`}
          emphasis={isZero ? "warning" : "default"}
        />
        {isZero && (
          <p className="pt-1 text-xs text-warning">{t.balance.zeroWarning}</p>
        )}
      </div>
    </section>
  );
}
