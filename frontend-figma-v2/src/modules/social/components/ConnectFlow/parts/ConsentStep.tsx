import { Check, X } from "lucide-react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/modules/monitoring/tracking/components/shared/PlatformIcon";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import type { SocialPlatformF06 } from "@/api/types";

interface ConsentStepProps {
  platform: SocialPlatformF06;
  onCancel: () => void;
  onContinue: () => void;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function ConsentStep({ platform, onCancel, onContinue }: ConsentStepProps) {
  const platformLabel = trackingStrings.syncStatus.platformLabels[platform];
  const copy = socialStrings.connectFlow.consent;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lm-gray-100">
            <PlatformIcon platform={platform} size={28} aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle>{interpolate(copy.title, { platform: platformLabel })}</DialogTitle>
            <DialogDescription>{copy.subtitle}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-5">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{copy.willDoTitle}</h3>
          <ul className="space-y-2">
            {copy.willDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-foreground">
                <Check size={18} aria-hidden="true" className="shrink-0 text-success mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{copy.neverDoTitle}</h3>
          <ul className="space-y-2">
            {copy.neverDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-foreground">
                <X size={18} aria-hidden="true" className="shrink-0 text-error/70 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {interpolate(copy.legal, { platform: platformLabel })}{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            {copy.privacyLink}
          </a>
          .
        </p>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel}>
          {copy.cancel}
        </Button>
        <Button variant="default" onClick={onContinue}>
          {interpolate(copy.continue, { platform: platformLabel })}
        </Button>
      </DialogFooter>
    </>
  );
}
