import { Toggle } from "@/components/ui/toggle";
import type { PurchaseStatus } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";

export type HistoryStatusFilter =
  | "all"
  | "confirmed"
  | "pending"
  | "review"
  | "rejected";

const FILTER_TO_STATUSES: Record<HistoryStatusFilter, PurchaseStatus[]> = {
  all: [],
  confirmed: ["confirmed"],
  pending: ["pending", "pending_payment", "pending_confirmation", "processing"],
  review: ["manual_review"],
  rejected: ["rejected", "failed"],
};

export function filterPurchasesByStatus<
  T extends { status: PurchaseStatus },
>(items: T[], filter: HistoryStatusFilter): T[] {
  const allowed = FILTER_TO_STATUSES[filter];
  if (!allowed.length) return items;
  return items.filter((p) => allowed.includes(p.status));
}

interface Props {
  value: HistoryStatusFilter;
  onChange: (next: HistoryStatusFilter) => void;
}

export function PurchaseHistoryFilters({ value, onChange }: Props) {
  const s = packagesStrings.history.filters;
  const options: Array<{ key: HistoryStatusFilter; label: string }> = [
    { key: "all", label: s.all },
    { key: "confirmed", label: s.confirmed },
    { key: "pending", label: s.pending },
    { key: "review", label: s.review },
    { key: "rejected", label: s.rejected },
  ];

  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{s.legend}</legend>
      {options.map((opt) => (
        <Toggle
          key={opt.key}
          pressed={value === opt.key}
          onPressedChange={(pressed) => {
            if (pressed) onChange(opt.key);
          }}
          variant="outline"
          size="sm"
          aria-label={opt.label}
          className="h-8 rounded-full border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {opt.label}
        </Toggle>
      ))}
      {value !== "all" ? (
        <button
          type="button"
          onClick={() => onChange("all")}
          className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          {s.clear}
        </button>
      ) : null}
    </fieldset>
  );
}
