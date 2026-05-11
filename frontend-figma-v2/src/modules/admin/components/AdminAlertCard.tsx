import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { adminStrings } from "../strings";
import type { AdminAlertMock } from "../mocks/adminMocks";

interface AdminAlertCardProps {
  alert: AdminAlertMock;
}

export function AdminAlertCard({ alert }: AdminAlertCardProps) {
  const copy = adminStrings.alerts.items[alert.titleKey];
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <AdminStatusBadge severity={alert.severity} />
          <span className="text-xs text-muted-foreground truncate max-w-[60%]">{alert.meta}</span>
        </div>
        <h3 className="text-base font-semibold text-foreground leading-snug">{copy.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{copy.body}</p>
        <Button variant="link" size="sm" className="h-auto justify-start p-0 text-foreground" asChild>
          <Link to={alert.href} className="inline-flex items-center gap-1">
            {adminStrings.alerts.cta}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
