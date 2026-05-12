import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, ListChecks, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  onLeave: () => void;
}

export function PostLicensingActions({ onLeave }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.step4.actions;

  const go = (path: string) => {
    onLeave();
    navigate(path);
  };

  return (
    <section className="rounded-[26px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-5">
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground">Próximas acciones</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Elige tu siguiente destino para seguir gestionando esta licencia o emitir una nueva.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          <Button onClick={() => go("/licenses")} className="justify-between sm:min-w-48">
            <span className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              {t.viewLicenses}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            variant="outline"
            onClick={() => go("/catalog")}
            className="justify-between bg-white sm:min-w-48"
          >
            <span className="flex items-center gap-2">
              <Music2 className="h-4 w-4" aria-hidden="true" />
              {t.licenseAnother}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => go("/dashboard03")}
            className="justify-between sm:min-w-44"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              {t.goToDashboard}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
