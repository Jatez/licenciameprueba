import { Calendar, Film, Image, Layers, Target, Users, type LucideIcon } from "lucide-react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatCredits } from "@/modules/packages/licensing/utils";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import type { UsageTypeCardViewModel } from "@/modules/packages/licensing/types";
import { UsageTypeDisabledBadge } from "./UsageTypeDisabledBadge";

const ICONS: Record<string, LucideIcon> = {
  Image,
  Layers,
  Calendar,
  Film,
  Target,
  Users,
};

interface Props {
  vm: UsageTypeCardViewModel;
}

export function UsageTypeCard({ vm }: Props) {
  const Icon = ICONS[vm.iconName] ?? Image;
  const isLicensabilityDisabled = vm.state === "disabled-licensability";
  const isInsufficient = vm.state === "disabled-credits";
  const isSelected = vm.state === "selected";

  const card = (
    <label
      htmlFor={`usage-type-${vm.id}`}
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-all",
        "hover:border-primary/50 hover:shadow-sm",
        isSelected && "border-metric bg-metric-subtle/30 ring-1 ring-metric",
        !isSelected && !isLicensabilityDisabled && !isInsufficient && "border-border bg-card",
        isInsufficient && "border-warning/25 bg-warning/[0.03]",
        isLicensabilityDisabled && "cursor-not-allowed border-border bg-muted/30 opacity-40 hover:border-border hover:shadow-none",
      )}
    >
      <RadioGroupItem
        id={`usage-type-${vm.id}`}
        value={vm.id}
        disabled={isLicensabilityDisabled}
        className="mt-0.5"
      />
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{vm.title}</span>
            {isLicensabilityDisabled && <UsageTypeDisabledBadge />}
          </div>
          <span className="flex-shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold tabular-nums text-secondary-foreground">
            {formatCredits(vm.creditCost)}
          </span>
        </div>
        <p className="text-[13px] leading-5 text-muted-foreground">{vm.description}</p>
        <p className="text-[12px] italic text-muted-foreground/90">{vm.example}</p>
        {isInsufficient && (
          <p className="text-[11px] font-medium text-warning/85">
            {licensingStrings.step2.insufficientForType}
          </p>
        )}
      </div>
    </label>
  );

  if (isLicensabilityDisabled && vm.disabledReason) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{card}</div>
          </TooltipTrigger>
          <TooltipContent>{vm.disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return card;
}
