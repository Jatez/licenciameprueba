import { Info, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notificationsStrings } from "../strings";
import { NotificationStatusBadge } from "./NotificationStatusBadge";
import type { NotificationItem } from "../types";

interface NotificationCardProps {
  item: NotificationItem;
  onViewEmail: (item: NotificationItem) => void;
  onViewEvent: (item: NotificationItem) => void;
}

export function NotificationCard({
  item,
  onViewEmail,
  onViewEvent,
}: NotificationCardProps) {
  const Icon = item.icon;
  const t = notificationsStrings.actions;
  const navigate = useNavigate();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3.5 p-4 sm:flex-row sm:items-start sm:gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15"
          aria-hidden="true"
        >
          <Icon size={20} className="text-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {item.title}
            </h3>
            <NotificationStatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{item.event}</p>
          <p className="mt-1.5 text-sm text-foreground/80">{item.description}</p>

          <p className="mt-2.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Contenido: </span>
            {item.contentSummary}
          </p>

          {item.pendingNote && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-warning-subtle/60 bg-warning-subtle/40 px-2 py-1 text-xs text-foreground/80">
              <Info size={12} aria-hidden="true" />
              <span>{item.pendingNote}</span>
            </div>
          )}

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewEmail(item)}
            >
              {t.viewEmail}
            </Button>
            {item.primaryAction && (
              <Button
                variant="default"
                size="sm"
                className="gap-1"
                onClick={() => navigate(item.primaryAction!.to)}
              >
                {item.primaryAction.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Button>
            )}
            <Button
              variant="link"
              size="sm"
              className="px-1"
              onClick={() => onViewEvent(item)}
            >
              {t.viewEvent}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
