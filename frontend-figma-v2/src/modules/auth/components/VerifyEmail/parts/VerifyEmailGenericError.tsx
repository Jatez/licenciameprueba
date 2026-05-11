import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStrings } from "../../../strings";

interface Props {
  onRetry: () => void;
}

export function VerifyEmailGenericError({ onRetry }: Props) {
  const t = authStrings.verifyEmail.errorGeneric;
  return (
    <div className="space-y-5 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive" aria-hidden="true" />
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button onClick={onRetry} variant="outline" className="w-full">
        <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
        {t.cta}
      </Button>
    </div>
  );
}
