import { ArrowRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { packagesStrings } from "@/modules/packages/packages/strings";

export function FifoExplainerCard() {
  const s = packagesStrings.walletHub.fifoExplainer;
  return (
    <Card className="h-full border-border bg-card text-card-foreground">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-foreground">{s.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <FifoStep label={s.stepNew} tone="muted" />
          <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <FifoStep label={s.stepActive} tone="active" />
          <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <FifoStep label={s.stepNext} tone="next" />
        </div>
      </CardContent>
    </Card>
  );
}

function FifoStep({ label, tone }: { label: string; tone: "muted" | "active" | "next" }) {
  const toneClass =
    tone === "next"
      ? "border-transparent bg-primary text-primary-foreground"
      : tone === "active"
        ? "border-success/40 bg-success/20 text-success"
        : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClass}`}
    >
      {label}
    </span>
  );
}
