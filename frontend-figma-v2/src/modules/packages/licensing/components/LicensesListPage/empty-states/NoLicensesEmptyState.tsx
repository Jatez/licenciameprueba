import { FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

export function NoLicensesEmptyState() {
  const navigate = useNavigate();
  const t = licensingStrings.list.empty.noLicenses;
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-metric-subtle/[0.63] text-metric">
        <FileText className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button onClick={() => navigate("/catalog")}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {t.cta}
      </Button>
    </div>
  );
}
