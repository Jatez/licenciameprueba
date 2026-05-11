import { CheckCircle2, AlertCircle, ArrowRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { matchTracksStrings as s } from "../strings";
import type {
  SocialIntegrationStatus,
  SocialPlatform,
} from "../types.social";

type PlatformKey = SocialPlatform | "spotify";

interface PlatformIntegrationCardProps {
  platform: PlatformKey;
  status: SocialIntegrationStatus | "manual";
  onAction: () => void;
  onError?: () => void;
  loading?: boolean;
}

const ICON: Record<SocialPlatform, "tiktok" | "facebook"> = {
  tiktok: "tiktok",
  meta: "facebook",
};

function StatusChip({
  platform,
  status,
}: {
  platform: PlatformKey;
  status: SocialIntegrationStatus | "manual";
}) {
  const copy = s.social.platforms;
  if (platform === "spotify") {
    return (
      <Badge variant="info" className="gap-1.5">
        {copy.spotify.statusManual}
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="expirada" className="gap-1.5">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        {copy.error}
      </Badge>
    );
  }
  const label =
    status === "demo_connected"
      ? copy[platform].statusDemo
      : copy[platform].statusConnected;
  return (
    <Badge variant="vigente" className="gap-1.5">
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

function PlatformGlyph({ platform }: { platform: PlatformKey }) {
  if (platform === "spotify") {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
        <SpotifyDot />
      </span>
    );
  }
  return <PlatformBadge platform={ICON[platform]} size="lg" />;
}

function SpotifyDot() {
  return (
    <span className="flex h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
  );
}

const TITLE: Record<PlatformKey, string> = {
  tiktok: "TikTok",
  meta: "Meta",
  spotify: "Spotify",
};

export function PlatformIntegrationCard({
  platform,
  status,
  onAction,
  onError,
  loading,
}: PlatformIntegrationCardProps) {
  const copy = s.social.platforms;
  const microcopy =
    platform === "spotify"
      ? copy.spotify.microcopy
      : copy[platform].microcopy;
  const cta =
    platform === "spotify" ? copy.spotify.cta : copy[platform].cta;

  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlatformGlyph platform={platform} />
          <div>
            <p className="text-base font-semibold text-foreground">{TITLE[platform]}</p>
            <StatusChip platform={platform} status={status} />
          </div>
        </div>
      </header>
      <p className="flex-1 text-sm text-muted-foreground">{microcopy}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAction} disabled={loading}>
          {cta}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
        {onError && platform !== "spotify" && (
          <Button variant="ghost" size="sm" onClick={onError}>
            Forzar error
          </Button>
        )}
      </div>
    </Card>
  );
}

// Re-export icon helper for potential reuse
export type { LucideIcon };
