import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardPeriod } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";

interface PeriodSelectorProps {
  value: DashboardPeriod;
  onChange: (p: DashboardPeriod) => void;
}

const ORDER: DashboardPeriod[] = ["7d", "30d", "90d", "ytd"];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const t = dashboardV2Strings.header;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] sm:min-h-0 gap-1.5"
          aria-label={t.periodAriaLabel}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{dashboardV2Strings.periods[value]}</span>
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as DashboardPeriod)}
        >
          {ORDER.map((p) => (
            <DropdownMenuRadioItem key={p} value={p}>
              {dashboardV2Strings.periods[p]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
