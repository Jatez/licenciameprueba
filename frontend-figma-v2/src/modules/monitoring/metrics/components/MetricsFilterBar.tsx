/**
 * F-11 · Sticky filter bar.
 *
 * - Period: dropdown of presets + "Personalizado…" range picker.
 * - Platform: multiselect chips (toggle).
 * - UseType: multiselect popover with checkboxes.
 * - SyncStatus: segmented control.
 * - Clear filters: only when filter ≠ default.
 *
 * Pure controlled component. Parent owns `filter` state.
 */
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type {
  LicenseUseType,
  MetricsFilter,
  PeriodPreset,
  SocialPlatform,
  SyncStatusFilter,
} from "../types";
import {
  metricsStrings,
  periodPresetLabels,
  platformLabels,
  useTypeLabels,
} from "../strings";
import { defaultFilter, isFilterDefault } from "../utils";

const PRESETS: PeriodPreset[] = [
  "last_7_days",
  "last_30_days",
  "last_90_days",
  "this_month",
  "last_month",
];

const PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook"];

const USE_TYPES: LicenseUseType[] = [
  "single-use",
  "stories-pack",
  "monthly-extended",
  "long-video",
  "paid-post",
  "collaborative-post",
];

const SYNC_OPTIONS: SyncStatusFilter[] = ["all", "synced_only", "with_issues"];

interface MetricsFilterBarProps {
  filter: MetricsFilter;
  onChange: (next: MetricsFilter) => void;
}

export function MetricsFilterBar({ filter, onChange }: MetricsFilterBarProps) {
  return (
    <div className="sticky top-0 z-30 -mx-4 border-b border-foreground/5 bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <PeriodSelect filter={filter} onChange={onChange} />
        <PlatformChips filter={filter} onChange={onChange} />
        <UseTypeMultiselect filter={filter} onChange={onChange} />
        <SyncStatusSegmented filter={filter} onChange={onChange} />
        {!isFilterDefault(filter) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-8 text-xs text-foreground/70"
            onClick={() => onChange(defaultFilter)}
          >
            <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            {metricsStrings.filters.clear}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Period ──────────────────────────────────────────────────────────────────

function PeriodSelect({ filter, onChange }: MetricsFilterBarProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Date | undefined>(
    filter.customRange ? new Date(filter.customRange.start) : undefined,
  );
  const [end, setEnd] = useState<Date | undefined>(
    filter.customRange ? new Date(filter.customRange.end) : undefined,
  );

  const label =
    filter.period === "custom" && filter.customRange
      ? `${format(new Date(filter.customRange.start), "d MMM")} – ${format(new Date(filter.customRange.end), "d MMM")}`
      : periodPresetLabels[filter.period];

  const rangeError = !!start && !!end && start.getTime() > end.getTime();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <span className="text-foreground/60">{metricsStrings.filters.period}:</span>
          <span className="font-medium text-foreground">{label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-foreground/60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {PRESETS.map((p) => (
          <DropdownMenuItem
            key={p}
            onSelect={() => onChange({ ...filter, period: p, customRange: undefined })}
            className={cn(filter.period === p && "bg-accent font-medium")}
          >
            {periodPresetLabels[p]}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent",
                filter.period === "custom" && "bg-accent font-medium",
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {periodPresetLabels.custom}…
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-3" side="right">
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs text-foreground/60">
                Desde
                <input
                  type="date"
                  value={start ? format(start, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    setStart(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  className="h-9 rounded-md border border-foreground/10 bg-background px-2 text-sm text-foreground"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-foreground/60">
                Hasta
                <input
                  type="date"
                  value={end ? format(end, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    setEnd(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  className="h-9 rounded-md border border-foreground/10 bg-background px-2 text-sm text-foreground"
                />
              </label>
            </div>
            {rangeError && (
              <p className="mt-2 text-xs text-foreground" role="alert">
                {metricsStrings.filters.customRangeError}
              </p>
            )}
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                disabled={!start || !end || rangeError}
                onClick={() => {
                  if (!start || !end || rangeError) return;
                  onChange({
                    ...filter,
                    period: "custom",
                    customRange: { start: start.toISOString(), end: end.toISOString() },
                  });
                  setOpen(false);
                }}
              >
                Aplicar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Platforms ───────────────────────────────────────────────────────────────

function PlatformChips({ filter, onChange }: MetricsFilterBarProps) {
  const togglePlatform = (p: SocialPlatform) => {
    const has = filter.platforms.includes(p);
    onChange({
      ...filter,
      platforms: has
        ? filter.platforms.filter((x) => x !== p)
        : [...filter.platforms, p],
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background p-0.5">
      {PLATFORMS.map((p) => {
        const active = filter.platforms.includes(p);
        return (
          <button
            key={p}
            type="button"
            onClick={() => togglePlatform(p)}
            aria-pressed={active}
            className={cn(
              "h-7 rounded-full px-3 text-xs transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            {platformLabels[p]}
          </button>
        );
      })}
    </div>
  );
}

// ─── Use type multiselect ────────────────────────────────────────────────────

function UseTypeMultiselect({ filter, onChange }: MetricsFilterBarProps) {
  const count = filter.useTypes.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <span className="text-foreground/60">{metricsStrings.filters.useType}:</span>
          <span className="font-medium text-foreground">
            {count === 0 ? "Todos" : `${count} seleccionados`}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-foreground/60" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-2">
        <ul className="flex flex-col gap-1">
          {USE_TYPES.map((u) => {
            const checked = filter.useTypes.includes(u);
            return (
              <li key={u}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      onChange({
                        ...filter,
                        useTypes: checked
                          ? filter.useTypes.filter((x) => x !== u)
                          : [...filter.useTypes, u],
                      })
                    }
                  />
                  <span className="text-sm text-foreground">{useTypeLabels[u]}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

// ─── Sync status segmented ───────────────────────────────────────────────────

function SyncStatusSegmented({ filter, onChange }: MetricsFilterBarProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background p-0.5"
      role="radiogroup"
      aria-label={metricsStrings.filters.syncStatus}
    >
      {SYNC_OPTIONS.map((s) => {
        const active = filter.syncStatusFilter === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange({ ...filter, syncStatusFilter: s })}
            className={cn(
              "h-7 rounded-full px-3 text-xs transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            {metricsStrings.filters.syncStatusOptions[s]}
          </button>
        );
      })}
    </div>
  );
}
