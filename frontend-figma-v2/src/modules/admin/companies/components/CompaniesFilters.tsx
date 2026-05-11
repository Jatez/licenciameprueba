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
import { companiesStrings } from "../strings";
import type { CompaniesFiltersState, CompanyPlanTier, CompanyStatus } from "../types";

interface Props {
  filters: CompaniesFiltersState;
  setFilters: (next: CompaniesFiltersState) => void;
  resetFilters: () => void;
  shown: number;
  total: number;
}

const STATUSES: CompanyStatus[] = ["active", "suspended", "overdue"];
const PLANS: CompanyPlanTier[] = ["bolsa-a", "bolsa-b", "bolsa-c", "custom"];

export function CompaniesFilters({ filters, setFilters, resetFilters, shown, total }: Props) {
  const t = companiesStrings.filters;
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder={t.searchPlaceholder}
            className="pl-9"
            aria-label={t.searchPlaceholder}
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) =>
            setFilters({ ...filters, status: v as CompaniesFiltersState["status"] })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]" aria-label={t.status}>
            <SelectValue placeholder={t.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allStatuses}</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {companiesStrings.status[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.plan}
          onValueChange={(v) =>
            setFilters({ ...filters, plan: v as CompaniesFiltersState["plan"] })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]" aria-label={t.plan}>
            <SelectValue placeholder={t.plan} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allPlans}</SelectItem>
            {PLANS.map((p) => (
              <SelectItem key={p} value={p}>
                {companiesStrings.plan[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="h-4 w-4" aria-hidden="true" />
          {t.clear}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground font-tnum">{t.counter(shown, total)}</p>
    </div>
  );
}
