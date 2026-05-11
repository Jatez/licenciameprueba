import type { License } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { formatLicenseDate } from "@/modules/packages/licensing/utils";

interface Props {
  license: License;
  termsVersion: string | undefined;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function shortHash(license: License): string {
  // Pseudo-hash deterministic from licenseTokenId for display purposes.
  // Backend will replace with a real signature hash.
  let h = 0;
  for (const c of license.licenseTokenId + license.id) {
    h = (h << 5) - h + c.charCodeAt(0);
    h |= 0;
  }
  return Math.abs(h).toString(16).padStart(8, "0").slice(0, 8);
}

export function LicenseDetailInfoBlock({ license, termsVersion }: Props) {
  const t = licensingStrings.detail;
  const usageLabel = licensingStrings.usageTypes[license.usageType].title;

  const trackRows: Array<[string, string]> = [
    [t.fields.track, license.trackSnapshot.title],
    [t.fields.artist, license.trackSnapshot.artist],
    [t.fields.album, license.trackSnapshot.album ?? "—"],
    [t.fields.duration, formatDuration(license.trackSnapshot.durationSec)],
    [t.fields.isrc, license.trackSnapshot.isrc ?? "—"],
  ];

  const licenseRows: Array<[string, string]> = [
    [t.fields.usageType, usageLabel],
    [t.fields.credits, String(license.creditsConsumed)],
    [t.fields.issuedAt, formatLicenseDate(license.issuedAt)],
    [t.fields.issuedBy, license.issuedByUserName],
    [t.fields.termsVersion, termsVersion ?? "—"],
    [t.fields.hash, shortHash(license)],
  ];

  return (
    <section
      aria-label={t.sections.info}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h2 className="text-sm font-semibold text-foreground">
        {t.sections.info}
      </h2>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {trackRows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 sm:block">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm font-medium text-foreground sm:mt-0.5">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="my-4 border-t border-border" />

      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {licenseRows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 sm:block">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm font-medium text-foreground sm:mt-0.5">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
