import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlatformIcon } from "@/modules/monitoring/tracking/components/shared/PlatformIcon";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import { cn } from "@/lib/utils";
import type { SocialPlatformF06 } from "@/api/types";
import { PLATFORM_BRAND } from "./PlatformBrand";

interface OAuthSimulatorStepProps {
  platform: SocialPlatformF06;
  /** True when the parent has flipped to the loading sub-state. */
  isLoading: boolean;
  /** "Cancel" inside the simulated popup body (user denies permissions). */
  onDeny: () => void;
  onAuthorize: () => void;
  /** Fires when the simulated handshake animation finishes. */
  onLoadingComplete: () => void;
}

const LOADER_TIMINGS = [600, 600, 600] as const;

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function OAuthSimulatorStep({
  platform,
  isLoading,
  onDeny,
  onAuthorize,
  onLoadingComplete,
}: OAuthSimulatorStepProps) {
  const platformLabel = trackingStrings.syncStatus.platformLabels[platform];
  const copy = socialStrings.connectFlow.oauth;
  const brand = PLATFORM_BRAND[platform];
  const permissions = copy.permissions[platform];

  const [loaderStep, setLoaderStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setLoaderStep(0);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    let acc = 0;
    LOADER_TIMINGS.forEach((ms, i) => {
      acc += ms;
      timers.push(
        setTimeout(() => {
          if (i < LOADER_TIMINGS.length - 1) {
            setLoaderStep(i + 1);
          } else {
            onLoadingComplete();
          }
        }, acc),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [isLoading, onLoadingComplete]);

  const loaderMessages = [
    copy.loading.verifying,
    copy.loading.fetching,
    copy.loading.connecting,
  ];

  return (
    <div className="flex flex-col">
      {/* Disclaimer banner (NOT part of the simulated chrome, sits above) */}
      <div
        className="rounded-md bg-warning/10 px-3 py-1.5 text-xs text-warning text-center mb-3"
        role="note"
      >
        {copy.simulationBanner}
      </div>

      {/* Fake browser chrome */}
      <div className="overflow-hidden rounded-lg border border-border shadow-lg bg-white">
        <div
          className={cn(
            "flex items-center justify-between gap-3 px-3 h-8 text-white text-xs",
            brand.headerBg,
          )}
        >
          <span className="inline-flex items-center gap-2 font-semibold">
            <PlatformIcon platform={platform} size={14} aria-hidden="true" />
            {platformLabel}
          </span>
          <span className="opacity-80 truncate">{brand.domain}</span>
        </div>

        <div className="p-5 text-neutral-900">
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-8"
              role="status"
              aria-live="polite"
            >
              <Loader2 size={32} className="animate-spin text-neutral-700" aria-hidden="true" />
              <p className="text-sm text-neutral-700">{loaderMessages[loaderStep]}</p>
            </div>
          ) : (
            <>
              <DialogTitle className="text-base text-neutral-900">
                {interpolate(copy.title, { platform: platformLabel })}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {interpolate(copy.title, { platform: platformLabel })}
              </DialogDescription>

              <div className="mt-4 flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
                  U
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">{copy.mockAccount}</span>
                  <span className="text-xs text-neutral-500">{copy.mockAccountHint}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {copy.permissionsTitle}
                </p>
                <ul className="space-y-2">
                  {permissions.map((perm) => (
                    <li key={perm} className="flex items-start gap-2 text-sm text-neutral-800">
                      <Checkbox checked disabled className="mt-0.5" />
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onAuthorize}
                  className={cn(
                    "h-10 w-full rounded-md text-sm font-semibold transition-colors",
                    brand.buttonBg,
                    brand.buttonText,
                  )}
                >
                  {copy.authorize}
                </button>
                <Button
                  variant="ghost"
                  onClick={onDeny}
                  className="h-9 w-full text-neutral-700 hover:bg-neutral-100"
                >
                  {copy.cancel}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
