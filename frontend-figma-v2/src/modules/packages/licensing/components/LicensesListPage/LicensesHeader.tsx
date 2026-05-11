import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

export function LicensesHeader() {
  const navigate = useNavigate();
  const t = licensingStrings.list;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>
      <Button onClick={() => navigate("/catalog")}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {t.newLicenseCta}
      </Button>
    </div>
  );
}
