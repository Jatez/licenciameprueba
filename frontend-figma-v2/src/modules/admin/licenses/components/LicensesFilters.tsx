import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { licensesStrings } from "../strings";
import { adminLicensesCompanies } from "../mocks";
import type {
  AdminLicenseStatus,
  AdminLicenseUsageType,
  LicensesFiltersState,
} from "../types";

const STATUSES: AdminLicenseStatus[] = ["active", "consumed", "expired", "cancelled", "disputed"];
const USAGES: AdminLicenseUsageType[] = [
  "single-use",
  "stories-pack",
  "monthly-extended",
  "long-video",
  "paid-post",
  "collaborative-post",
];
const RANGES: LicensesFiltersState["range"][] = ["7d", "30d", "90d", "all"];

interface Props {
  value: LicensesFiltersState;
  onChange: (next: LicensesFiltersState) => void;
  onReset: () => void;
  shown: number;
  total: number;
}

export function LicensesFilters({ value, onChange, onReset, shown, total }: Props) {
  const t = licensesStrings.filters;
  const set = <K extends keyof LicensesFiltersState>(k: K, v: LicensesFiltersState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
        <div className="md:col-span-4 relative">
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
          <Select value={value.status} onValueChange={(v) => set("status", v as LicensesFiltersState["status"])}>
            <SelectTrigger aria-label={t.status}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {licensesStrings.status[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select
            value={value.usageType}
            onValueChange={(v) => set("usageType", v as LicensesFiltersState["usageType"])}
          >
            <SelectTrigger aria-label={t.usageType}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allUsage}</SelectItem>
              {USAGES.map((u) => (
                <SelectItem key={u} value={u}>
                  {licensesStrings.usageType[u]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select
            value={value.company}
            onValueChange={(v) => set("company", v as LicensesFiltersState["company"])}
          >
            <SelectTrigger aria-label={t.company}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCompanies}</SelectItem>
              {adminLicensesCompanies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Select value={value.range} onValueChange={(v) => set("range", v as LicensesFiltersState["range"])}>
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox
            checked={value.onlyHiddenTracks}
            onCheckedChange={(c) => set("onlyHiddenTracks", Boolean(c))}
          />
          {t.onlyHiddenTracks}
        </label>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{t.counter(shown, total)}</p>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            {t.clear}
          </Button>
        </div>
      </div>
    </div>
  );
}
