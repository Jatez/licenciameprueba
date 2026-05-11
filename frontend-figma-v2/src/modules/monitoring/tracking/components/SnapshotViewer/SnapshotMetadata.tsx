import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface SnapshotMetadataProps {
  post: DetectedPost;
  licenseTokenId?: string;
}

export function SnapshotMetadata({ post, licenseTokenId }: SnapshotMetadataProps) {
  const t = trackingStrings.snapshotViewer;
  const platformLabel = trackingStrings.syncStatus.platformLabels[post.platform];
  const postTypeLabel = trackingStrings.postCard.postType[post.postType];

  const lifetime = computeLifetime(post);
  const interactions = post.metrics
    ? post.metrics.likes + post.metrics.comments + post.metrics.shares + post.metrics.saves
    : null;

  return (
    <div className="space-y-4">
      <Section title={t.sections.metadata}>
        <Row label={t.fields.platform} value={platformLabel} />
        <Row label={t.fields.postType} value={postTypeLabel} />
        <Row
          label={t.fields.originalUrl}
          value={t.fields.originalUrlUnavailable.replace("{url}", post.externalUrl)}
        />
        <Row
          label={t.fields.publishedAt}
          value={format(new Date(post.publishedAt), "PPp", { locale: es })}
        />
        <Row
          label={t.fields.detectedAt}
          value={format(new Date(post.detectedAt), "PPp", { locale: es })}
        />
        {lifetime && <Row label={t.fields.lifetime} value={lifetime} />}
      </Section>

      <Section title={t.sections.metrics}>
        {post.metrics ? (
          <>
            <Row
              label={t.fields.reproductions}
              value={post.metrics.reproductions.toLocaleString("es-CO")}
            />
            {interactions !== null && (
              <Row
                label={t.fields.interactions}
                value={interactions.toLocaleString("es-CO")}
              />
            )}
          </>
        ) : (
          <p className="text-sm italic text-muted-foreground">{t.fields.noMetrics}</p>
        )}
      </Section>

      <Section title={t.sections.track}>
        <p className="text-sm text-foreground">
          "{post.snapshot.detectedTrackTitle}" — {post.snapshot.detectedArtist}
        </p>
      </Section>

      <Section title={t.sections.license}>
        {licenseTokenId ? (
          <p className="text-sm font-medium text-foreground">{licenseTokenId}</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">{t.fields.noLicense}</p>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <dl className="space-y-1">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
      <dt className="min-w-[110px] text-muted-foreground">{label}:</dt>
      <dd className="flex-1 break-all text-foreground">{value}</dd>
    </div>
  );
}

function computeLifetime(post: DetectedPost): string | null {
  if (!post.evidenceExpiresAt) return null;
  const start = new Date(post.publishedAt).getTime();
  const end = new Date(post.evidenceExpiresAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  const totalMin = Math.round((end - start) / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}
