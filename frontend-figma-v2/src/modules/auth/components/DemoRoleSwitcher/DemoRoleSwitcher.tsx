import { Building2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authStrings } from "@/modules/auth/strings";

type DemoRoleSwitcherProps = {
  onPick: (email: string, password: string) => void;
  disabled?: boolean;
};

/**
 * MOCK ONLY — quick role pickers for demos. Should be removed once a real
 * backend is wired and credentials become user-managed.
 */
export function DemoRoleSwitcher({ onPick, disabled }: DemoRoleSwitcherProps) {
  const t = authStrings.demoSwitcher;
  return (
    <div className="rounded-card border border-dashed border-foreground/15 bg-muted/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">{t.title}</p>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
          {t.badge}
        </Badge>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{t.description}</p>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled={disabled}
          onClick={() => onPick("empresa@licenciame.com", "demo1234")}
        >
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          {t.company}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled={disabled}
          onClick={() => onPick("admin@licenciame.com", "admin1234")}
        >
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {t.admin}
        </Button>
      </div>
    </div>
  );
}
