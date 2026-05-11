import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "../../../hooks/usePlayer";
import { usePlayerStore } from "@/stores/playerStore";
import { playerStrings } from "../../../strings";

export function PlayerErrorBanner() {
  const { retry } = usePlayer();
  const setError = usePlayerStore((s) => s.setError);

  return (
    <div
      role="alert"
      className="absolute inset-x-0 -top-12 mx-auto flex max-w-xl items-center gap-3 rounded-card border border-error bg-error-subtle px-4 py-2 shadow-md"
    >
      <AlertCircle size={18} className="text-error flex-shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm text-lm-gray-900">{playerStrings.error.loadFailed}</p>
      <Button type="button" variant="ghost" size="sm" onClick={retry}>
        {playerStrings.error.retry}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setError(null)}>
        {playerStrings.error.dismiss}
      </Button>
    </div>
  );
}
