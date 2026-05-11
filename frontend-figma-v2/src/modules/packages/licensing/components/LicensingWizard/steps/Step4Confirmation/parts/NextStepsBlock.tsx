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
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">{t.title}</h3>
      <ol className="space-y-3">
        {[t.step1, t.step2, t.step3].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <p className="pt-0.5 text-sm text-foreground">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => go("/social-accounts")}
        >
          {t.connectSocialCta}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => go("/dashboard03")}>
          {t.dashboardCta}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
