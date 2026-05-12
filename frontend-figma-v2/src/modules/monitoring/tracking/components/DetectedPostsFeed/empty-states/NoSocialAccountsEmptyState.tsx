import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

export function NoSocialAccountsEmptyState() {
  const navigate = useNavigate();
  const t = trackingStrings.monitoring.empty.noSocialAccounts;
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Link2Off size={36} className="text-muted-foreground" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{t.message}</p>
      <Button onClick={() => navigate("/social")}>{t.cta}</Button>
    </Card>
  );
}
