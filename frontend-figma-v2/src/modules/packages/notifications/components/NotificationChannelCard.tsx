import { ShieldCheck, Mail, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notificationsStrings } from "../strings";
import type { NotificationChannelState } from "../types";

interface NotificationChannelCardProps {
  state: NotificationChannelState;
}

export function NotificationChannelCard({ state }: NotificationChannelCardProps) {
  const t = notificationsStrings.channelCard;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 shrink-0">
            <Mail size={18} className="text-foreground" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{t.disclaimer}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <ChannelField label={t.recipientLabel} value={state.recipientEmail} />
          <ChannelField
            label={t.statusLabel}
            value={
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-foreground" aria-hidden="true" />
                {t.verified}
              </span>
            }
          />
          <ChannelField
            label={t.channelLabel}
            value={
              <Badge variant="vigente" className="gap-1">
                <ShieldCheck size={12} aria-hidden="true" />
                {t.channel}
              </Badge>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
