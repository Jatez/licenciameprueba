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
import { auditStrings } from "../strings";
import type { AuditFiltersState, AuditModule, AuditSeverity } from "../types";

const SEVERITIES: AuditSeverity[] = ["info", "warning", "critical", "success"];
const MODULES: AuditModule[] = [
  "catalog",
  "companies",
  "billing",
  "licenses",
  "access",
  "pricing",
  "auth",
  "system",
];
const RANGES: AuditFiltersState["range"][] = ["24h", "7d", "30d", "all"];

interface Props {
  value: AuditFiltersState;
  onChange: (next: AuditFiltersState) => void;
  onReset: () => void;
  shown: number;
  total: number;
}

export function AuditFilters({ value, onChange, onReset, shown, total }: Props) {
  const t = auditStrings.filters;
  const set = <K extends keyof AuditFiltersState>(k: K, v: AuditFiltersState[K]) =>
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
          <Select
            value={value.severity}
            onValueChange={(v) => set("severity", v as AuditFiltersState["severity"])}
          >
            <SelectTrigger aria-label={t.severity}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allSeverities}</SelectItem>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {auditStrings.severity[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Select
            value={value.module}
            onValueChange={(v) => set("module", v as AuditFiltersState["module"])}
          >
            <SelectTrigger aria-label={t.module}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allModules}</SelectItem>
              {MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {auditStrings.module[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Select value={value.range} onValueChange={(v) => set("range", v as AuditFiltersState["range"])}>
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
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              checked={value.onlyCritical}
              onCheckedChange={(c) => set("onlyCritical", Boolean(c))}
            />
            {t.onlyCritical}
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              checked={value.onlyUnreviewed}
              onCheckedChange={(c) => set("onlyUnreviewed", Boolean(c))}
            />
            {t.onlyUnreviewed}
          </label>
        </div>
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
