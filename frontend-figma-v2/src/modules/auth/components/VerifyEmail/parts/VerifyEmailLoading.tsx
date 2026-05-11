import { Loader2 } from "lucide-react";
import { authStrings } from "../../../strings";

export function VerifyEmailLoading() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{authStrings.verifyEmail.loading.title}</p>
    </div>
  );
}
