import { Card, CardContent } from "@/components/ui/card";
import { catalogStrings } from "../strings";
import { adminCatalogStats } from "../mocks";

interface StatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "danger" | "muted";
}

const TONE: Record<NonNullable<StatProps["tone"]>, string> = {
  default: "text-foreground",
  warn: "text-foreground",
  danger: "text-foreground",
  muted: "text-muted-foreground",
};

function Stat({ label, value, hint, tone = "default" }: StatProps) {
  return (
    <Card>
      <CardContent className="p-5 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`text-2xl font-semibold font-tnum ${TONE[tone]}`}>{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function CatalogStats() {
  const t = catalogStrings.stats;
  const s = adminCatalogStats;
  const fmt = (n: number) => n.toLocaleString("es-CO");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      <Stat label={t.total} value={fmt(s.total)} />
      <Stat label={t.active} value={fmt(s.active)} />
      <Stat label={t.hidden} value={fmt(s.hidden)} tone="warn" />
      <Stat label={t.legalReview} value={fmt(s.legalReview)} tone="danger" />
      <Stat label={t.withActiveLicenses} value={fmt(s.withActiveLicenses)} />
      <Stat label={t.lastUpdate} value={s.lastUpdateLabel} tone="muted" />
    </div>
  );
}
