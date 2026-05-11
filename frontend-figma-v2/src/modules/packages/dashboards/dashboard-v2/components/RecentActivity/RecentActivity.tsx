import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import type { UserActivity } from "@/api/types.dashboard";
import {
  USER_ACTIVITY_FILTERS,
  USER_ACTIVITY_TYPES,
  matchesUserActivityFilter,
  type UserActivityFilterKey,
} from "@/shared/constants/activityTypes";
import { dashboardV2Strings } from "../../strings";
import { useActivityFilter } from "../../hooks/useActivityFilter";
import { groupUserActivityByMoment } from "../../utils/groupUserActivityByMoment";
import { UserActivityItem } from "@/shared/components/activity/UserActivityItem";
import { MomentHeader } from "./MomentHeader";

interface RecentActivityProps {
  items: UserActivity[];
  isLoading?: boolean;
}

const MAX_VISIBLE = 6;

export function RecentActivity({ items, isLoading }: RecentActivityProps) {
  const t = dashboardV2Strings.recentActivity;
  const { filter, setFilter } = useActivityFilter();

  const counts = useMemo(() => {
    const base: Record<UserActivityFilterKey, number> = {
      all: items.length,
      licenses: 0,
      credits: 0,
      connections: 0,
      catalog: 0,
      reports: 0,
    };
    for (const item of items) {
      const cat = USER_ACTIVITY_TYPES[item.type].category;
      if (cat in base) base[cat as UserActivityFilterKey] += 1;
    }
    return base;
  }, [items]);

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-3 p-6">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as UserActivityFilterKey)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
          <TabsList className="-mx-4 flex w-auto max-w-full justify-start overflow-x-auto scrollbar-hide px-4 sm:mx-0 sm:px-0 md:flex-wrap md:justify-end">
            {USER_ACTIVITY_FILTERS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                <span>{tab.label}</span>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-tnum">
                  {counts[tab.key]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {USER_ACTIVITY_FILTERS.map((tab) => {
          const filtered = items
            .filter((i) => matchesUserActivityFilter(i.type, tab.key))
            .slice(0, MAX_VISIBLE);

          return (
            <TabsContent
              key={tab.key}
              value={tab.key}
              forceMount
              className={filter === tab.key ? "mt-4 flex flex-col gap-2" : "hidden"}
            >
              {filtered.length === 0 ? (
                <EmptyStateCard
                  icon={Sparkles}
                  title={t.emptyTitle}
                  description={t.emptyDescription}
                  ctaLabel={t.emptyCta}
                  ctaHref="/catalog"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {groupUserActivityByMoment(filtered).map((group) => (
                    <section key={group.key} className="flex flex-col gap-1">
                      <MomentHeader label={group.label} timestamp={group.representativeTimestamp} />
                      <ul className="flex flex-col">
                        {group.items.map((item) => (
                          <UserActivityItem key={item.id} item={item} />
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
              <Link
                to="/activity"
                className="self-start text-sm font-medium text-foreground hover:underline"
              >
                {t.viewAll}
              </Link>
            </TabsContent>
          );
        })}
      </Tabs>
    </Card>
  );
}