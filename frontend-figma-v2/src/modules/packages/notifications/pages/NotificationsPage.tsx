import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { NotificationChannelCard } from "../components/NotificationChannelCard";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationEmailPreviewSheet } from "../components/NotificationEmailPreviewSheet";
import { PendingRulesSection } from "../components/PendingRulesSection";
import { OperationalRiskCard } from "../components/OperationalRiskCard";
import { SpecialStatesSection } from "../components/SpecialStatesSection";
import { PendingDefinitionsChecklist } from "../components/PendingDefinitionsChecklist";
import {
  mockChannelState,
  mockNotifications,
  mockPendingRules,
} from "../mocks";
import { notificationsStrings } from "../strings";
import type { NotificationItem } from "../types";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";

export function NotificationsPage() {
  const t = notificationsStrings.page;
  const list = notificationsStrings.list;
  const { toast } = useToast();

  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewEmail = (item: NotificationItem) => {
    setSelected(item);
    setSheetOpen(true);
  };

  const handleViewEvent = (item: NotificationItem) => {
    toast({
      title: item.title,
      description: `${item.event} · ${notificationsStrings.status[item.status]}`,
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <AppPageHeader title={t.title} description={t.subtitle} liftStickyDesktop />

      <section className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="info">{t.rulesBadge}</Badge>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground/70">
          {t.bullets.map((b) => (
            <li key={b} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              {b}
            </li>
          ))}
        </ul>
      </section>

      <NotificationChannelCard state={mockChannelState} />

      <section className="flex flex-col gap-3.5">
        <header>
          <h2 className="text-lg font-semibold text-foreground">{list.title}</h2>
          <p className="text-sm text-muted-foreground">{list.subtitle}</p>
        </header>
        <div className="flex flex-col gap-3">
          {mockNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onViewEmail={handleViewEmail}
              onViewEvent={handleViewEvent}
            />
          ))}
        </div>
      </section>

      <PendingRulesSection rules={mockPendingRules} />

      <OperationalRiskCard />

      <SpecialStatesSection />

      <PendingDefinitionsChecklist />

      <NotificationEmailPreviewSheet
        item={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
