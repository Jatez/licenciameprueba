import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  onLeave: () => void;
}

export function NextStepsBlock({ onLeave }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.step4.nextSteps;

  const go = (path: string) => {
    onLeave();
    navigate(path);
  };

  return (
    <section
      aria-label={t.title}
      className="rounded-[26px] border border-black/5 bg-white/94 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-5"
    >
      <h3 className="text-base font-semibold text-foreground">{t.title}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Usa estos accesos para continuar con la activación y el seguimiento de la licencia recién emitida.
      </p>
      <ol className="mt-4 space-y-2.5">
        {[t.step1, t.step2, t.step3].map((step, i) => (
          <li key={i} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-muted/30 px-4 py-2.5">
            <span
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <p className="pt-0.5 text-sm leading-6 text-foreground">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Button
          variant="outline"
          onClick={() => go("/social")}
          className="bg-white"
        >
          {t.connectSocialCta}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Button>
        <Button variant="ghost" onClick={() => go("/dashboard03")}>
          {t.dashboardCta}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
