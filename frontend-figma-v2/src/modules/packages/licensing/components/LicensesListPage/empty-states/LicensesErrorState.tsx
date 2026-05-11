import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  onRetry: () => void;
}

export function LicensesErrorState({ onRetry }: Props) {
  const t = licensingStrings.list.error;
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button onClick={onRetry}>{t.cta}</Button>
    </div>
  );
}
