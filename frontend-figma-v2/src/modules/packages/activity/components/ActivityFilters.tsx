import { useMemo } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  USER_ACTIVITY_TYPES,
  type UserActivityCategory,
} from "@/shared/constants/activityTypes";
import type { UserActivityType } from "@/api/types.dashboard";
import { activityStrings } from "../strings";
import type { ActivityFilters as ActivityFiltersValue } from "../hooks/useActivityFeed";

interface ActivityFiltersProps {
  value: ActivityFiltersValue;
  onChange: (next: ActivityFiltersValue) => void;
  actors: { user_id: string; user_name: string }[];
}

const CATEGORY_ORDER: UserActivityCategory[] = [
  "licenses",
  "credits",
  "connections",
  "catalog",
  "reports",
  "company",
];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function ActivityFilters({ value, onChange, actors }: ActivityFiltersProps) {
  const t = activityStrings.filters;

  const groupedTypes = useMemo(() => {
    const groups: Record<UserActivityCategory, UserActivityType[]> = {
      licenses: [],
      credits: [],
      connections: [],
      catalog: [],
      reports: [],
      company: [],
    };
    for (const [type, cfg] of Object.entries(USER_ACTIVITY_TYPES) as [UserActivityType, typeof USER_ACTIVITY_TYPES[UserActivityType]][]) {
      groups[cfg.category].push(type);
    }
    return groups;
  }, []);

  const toggleType = (type: UserActivityType) => {
    const set = new Set(value.types ?? []);
    if (set.has(type)) set.delete(type);
    else set.add(type);
    onChange({ ...value, types: set.size ? [...set] : undefined });
  };

  const toggleActor = (id: string) => {
    const set = new Set(value.actors ?? []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...value, actors: set.size ? [...set] : undefined });
  };

  const setPreset = (days: number) => {
    onChange({ ...value, from: isoDaysAgo(days), to: isoDaysAgo(0) });
  };

  const clearAll = () => onChange({ from: isoDaysAgo(30), to: isoDaysAgo(0) });

  const activeCount =
    (value.types?.length ?? 0) + (value.actors?.length ?? 0);

  return (
    <aside className="flex flex-col gap-5 rounded-card border border-border bg-card p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{t.title}</h2>
        {activeCount > 0 && (
          <Badge variant="secondary" className="font-tnum">
            {activeCount}
          </Badge>
        )}
      </header>

      {/* Date range */}
      <section className="flex flex-col gap-2">
        <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {t.dateRange}
        </Label>
        <div className="flex flex-wrap gap-1">
          {([7, 30, 90] as const).map((d) => (
            <Button
              key={d}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setPreset(d)}
              className="h-7 px-2 text-[11px]"
            >
              {t.presets[`${d}d` as "7d" | "30d" | "90d"]}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="filter-from" className="text-[10px] text-muted-foreground">
              {t.from}
            </Label>
            <Input
              id="filter-from"
              type="date"
              value={value.from ?? ""}
              onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
              className="h-8 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="filter-to" className="text-[10px] text-muted-foreground">
              {t.to}
            </Label>
            <Input
              id="filter-to"
              type="date"
              value={value.to ?? ""}
              onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </section>

      {/* Activity types grouped by category */}
      <section className="flex flex-col gap-3">
        <Label className="text-xs font-medium text-foreground">{t.types}</Label>
        <div className="flex flex-col gap-3">
          {CATEGORY_ORDER.map((cat) => (
            <div key={cat} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t.categories[cat]}
              </span>
              {groupedTypes[cat].map((type) => {
                const cfg = USER_ACTIVITY_TYPES[type];
                const checked = (value.types ?? []).includes(type);
                const id = `type-${type}`;
                return (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox id={id} checked={checked} onCheckedChange={() => toggleType(type)} />
                    <Label htmlFor={id} className="cursor-pointer text-xs text-foreground">
                      {cfg.title}
                    </Label>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Actors */}
      <section className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-foreground">{t.actors}</Label>
        <div className="flex flex-col gap-1.5">
          {actors.map((a) => {
            const checked = (value.actors ?? []).includes(a.user_id);
            const id = `actor-${a.user_id}`;
            return (
              <div key={a.user_id} className="flex items-center gap-2">
                <Checkbox id={id} checked={checked} onCheckedChange={() => toggleActor(a.user_id)} />
                <Label htmlFor={id} className="cursor-pointer text-xs text-foreground">
                  {a.user_name}
                </Label>
              </div>
            );
          })}
        </div>
      </section>

      <Button variant="ghost" size="sm" onClick={clearAll} className="self-start gap-1.5">
        <X className="h-3.5 w-3.5" aria-hidden="true" /> {t.clear}
      </Button>
    </aside>
  );
}