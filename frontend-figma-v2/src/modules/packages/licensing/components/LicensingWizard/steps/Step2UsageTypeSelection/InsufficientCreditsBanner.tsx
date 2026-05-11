import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";

interface Props {
  needed: number;
  available: number;
  onBuyCredits: () => void;
  onChooseOther: () => void;
}

export function InsufficientCreditsBanner({
  needed,
  available,
  onBuyCredits,
  onChooseOther,
}: Props) {
  const t = licensingStrings.insufficientBanner;
  const missing = Math.max(0, needed - available);
  return (
    <Alert role="alert" variant="destructive" className="border-destructive/40">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t.title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{formatString(t.message, { needed, available, missing })}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onBuyCredits}>
            {t.buyCta}
          </Button>
          <Button size="sm" variant="outline" onClick={onChooseOther}>
            {t.chooseOtherCta}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
