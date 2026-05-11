import { useEffect } from "react";
import { Bug, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { socialStrings } from "@/modules/social/strings";
import {
  type SocialDebugFlag,
  useSocialDebugStore,
} from "@/modules/social/stores/socialDebugStore";

const FLAGS: SocialDebugFlag[] = [
  "popupBlocked",
  "accountTaken",
  "forceInstagramExpired",
  "syncNetworkError",
  "simulatePermissionsRevoked",
  "simulateDuplicateAccount",
];

export function DebugPanel() {
  const copy = socialStrings.debug;
  const qc = useQueryClient();
  const {
    panelOpen,
    setPanelOpen,
    togglePanel,
    setFlag,
    reset,
    popupBlocked,
    accountTaken,
    forceInstagramExpired,
    syncNetworkError,
    simulatePermissionsRevoked,
    simulateDuplicateAccount,
  } = useSocialDebugStore();

  // Shift + D toggles the panel.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        togglePanel();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePanel]);

  const values: Record<SocialDebugFlag, boolean> = {
    popupBlocked,
    accountTaken,
    forceInstagramExpired,
    syncNetworkError,
    simulatePermissionsRevoked,
    simulateDuplicateAccount,
  };

  const handleFlag = (key: SocialDebugFlag, next: boolean) => {
    setFlag(key, next);
    // Re-fetch accounts whenever a list-affecting flag changes.
    if (
      key === "forceInstagramExpired" ||
      key === "simulatePermissionsRevoked" ||
      key === "simulateDuplicateAccount"
    ) {
      qc.invalidateQueries({ queryKey: ["social", "accounts"] });
    }
  };

  const handleReset = () => {
    reset();
    qc.invalidateQueries({ queryKey: ["social", "accounts"] });
    toast.success(copy.resetToast);
  };

  if (!panelOpen) {
    return (
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => setPanelOpen(true)}
        aria-label={copy.open}
        className="fixed bottom-4 right-4 z-40 rounded-full opacity-60 hover:opacity-100 shadow-md"
      >
        <Bug className="h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto p-4 shadow-2xl border-border">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
            <Bug className="h-4 w-4" aria-hidden="true" />
            {copy.title}
          </h3>
          <p className="text-xs text-muted-foreground">{copy.subtitle}</p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setPanelOpen(false)}
          aria-label={copy.close}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="space-y-3">
        {FLAGS.map((flag) => {
          const id = `debug-${flag}`;
          return (
            <div key={flag} className="flex items-center justify-between gap-3">
              <Label htmlFor={id} className="text-xs cursor-pointer flex-1">
                {copy.flags[flag]}
              </Label>
              <Switch
                id={id}
                checked={values[flag]}
                onCheckedChange={(v) => handleFlag(flag, v)}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">{copy.shortcutHint}</span>
        <Button type="button" size="sm" variant="outline" onClick={handleReset}>
          {copy.reset}
        </Button>
      </div>
    </Card>
  );
}
