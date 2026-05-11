import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MatchSourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  highlighted?: boolean;
}

export function MatchSourceCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
  highlighted,
}: MatchSourceCardProps) {
  return (
    <Card
      className={`flex h-full flex-col justify-between gap-6 p-6 ${
        highlighted ? "border-primary bg-primary/5" : ""
      }`}
    >
      <div className="space-y-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onClick} variant={highlighted ? "default" : "outline"} className="w-fit">
        {cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </Card>
  );
}
