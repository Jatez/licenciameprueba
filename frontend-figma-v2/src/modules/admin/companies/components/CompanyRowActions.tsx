import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, PauseCircle, PlayCircle, Sparkles } from "lucide-react";
import { companiesStrings } from "../strings";
import type { AdminCompany } from "../types";

interface Props {
  company: AdminCompany;
  onView: (company: AdminCompany) => void;
  onAssignPlan: (company: AdminCompany) => void;
  onSuspend: (company: AdminCompany) => void;
  onReactivate: (company: AdminCompany) => void;
}

export function CompanyRowActions({
  company,
  onView,
  onAssignPlan,
  onSuspend,
  onReactivate,
}: Props) {
  const t = companiesStrings.rowActions;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Acciones">
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onSelect={() => onView(company)}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          {t.viewDetail}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAssignPlan(company)}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {t.assignPlan}
        </DropdownMenuItem>
        {company.status === "suspended" ? (
          <DropdownMenuItem onSelect={() => onReactivate(company)}>
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {t.reactivate}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onSuspend(company)}>
            <PauseCircle className="h-4 w-4" aria-hidden="true" />
            {t.suspend}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
