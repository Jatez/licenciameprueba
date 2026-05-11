import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { billingStrings } from "../strings";
import type { BillingFiltersState, PaymentMethod, PaymentStatus } from "../types";

const STATUSES: PaymentStatus[] = ["paid", "pending", "processing", "failed", "refunded", "disputed"];
const METHODS: PaymentMethod[] = ["pse", "transfer", "card", "credit_note"];
const RANGES: BillingFiltersState["range"][] = ["7d", "30d", "90d", "all"];

interface Props {
  value: BillingFiltersState;
  onChange: (next: BillingFiltersState) => void;
  onReset: () => void;
  shown: number;
  total: number;
}

export function BillingFilters({ value, onChange, onReset, shown, total }: Props) {
  const t = billingStrings.filters;
  const set = <K extends keyof BillingFiltersState>(k: K, v: BillingFiltersState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
        <div className="md:col-span-5 relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={value.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-9"
            aria-label={t.searchPlaceholder}
          />
        </div>
        <div className="md:col-span-2">
          <Select value={value.status} onValueChange={(v) => set("status", v as BillingFiltersState["status"])}>
            <SelectTrigger aria-label={t.status}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {billingStrings.status[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={value.method} onValueChange={(v) => set("method", v as BillingFiltersState["method"])}>
            <SelectTrigger aria-label={t.method}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allMethods}</SelectItem>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {billingStrings.method[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Select value={value.range} onValueChange={(v) => set("range", v as BillingFiltersState["range"])}>
            <SelectTrigger aria-label={t.range}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r} value={r}>
                  {t.ranges[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <p className="text-xs text-muted-foreground">{t.counter(shown, total)}</p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          {t.clear}
        </Button>
      </div>
    </div>
  );
}
