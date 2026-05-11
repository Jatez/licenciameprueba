import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { platformIntegrations } from "../mocks";
import { matchTracksStrings } from "../strings";
import { MatchSourceBadge } from "./MatchSourceBadge";
import type { IntegrationStatus } from "../types";

const STATUS_ICON: Record<IntegrationStatus, typeof CheckCircle2> = {
  connected: CheckCircle2,
  disconnected: XCircle,
  error: AlertCircle,
};

const STATUS_COLOR: Record<IntegrationStatus, string> = {
  connected: "text-success",
  disconnected: "text-muted-foreground",
  error: "text-error",
};

export function MockIntegrationStatus() {
  return (
    <Card className="p-6">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {matchTracksStrings.hub.integrations.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {matchTracksStrings.hub.integrations.subtitle}
        </p>
      </header>

      <ul className="space-y-3">
        {platformIntegrations.map((integration) => {
          const Icon = STATUS_ICON[integration.status];
          return (
            <li
              key={integration.platform}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <MatchSourceBadge source={integration.platform} />
                {integration.account && (
                  <span className="text-xs text-muted-foreground">{integration.account}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-xs ${STATUS_COLOR[integration.status]}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {matchTracksStrings.status[integration.status]}
                </span>
                {integration.status !== "connected" && (
                  <Button size="sm" variant="ghost">
                    Conectar
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
