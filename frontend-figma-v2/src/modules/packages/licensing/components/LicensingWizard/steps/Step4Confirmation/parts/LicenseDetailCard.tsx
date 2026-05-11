import { Badge } from "@/components/ui/badge";
import type { License } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { formatCredits, formatLicenseDate, hoursBetween } from "@/modules/packages/licensing/utils";

interface Props {
  license: License;
  newWalletBalance: number;
  walletExpiresInDays: number | null;
}

const STATUS_VARIANT = {
  active: "vigente",
  consumed: "consumida",
  expired: "expirada",
  cancelled: "consumida",
} as const;

export function LicenseDetailCard({
  license,
  newWalletBalance,
  walletExpiresInDays,
}: Props) {
  const t = licensingStrings.step4;
  const usage = licensingStrings.usageTypes[license.usageType];

  const cancellableHours = license.cancellableUntil
    ? hoursBetween(license.issuedAt, license.cancellableUntil)
    : 0;

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: t.fields.track,
      value: `${license.trackSnapshot.title} — ${license.trackSnapshot.artist}`,
    },
    { label: t.fields.usageType, value: usage.title },
    { label: t.fields.creditsUsed, value: formatCredits(license.creditsConsumed) },
    { label: t.fields.issuedAt, value: formatLicenseDate(license.issuedAt) },
    {
      label: t.fields.status,
      value: (
        <Badge variant={STATUS_VARIANT[license.status]}>
          {t.statusLabels[license.status]}
        </Badge>
      ),
    },
    { label: t.fields.issuedBy, value: license.issuedByUserName },
    {
      label: t.fields.cancellableUntil,
      value: license.cancellableUntil
        ? `${formatLicenseDate(license.cancellableUntil)} (${cancellableHours}h)`
        : "—",
    },
    {
      label: t.fields.currentBalance,
      value:
        walletExpiresInDays !== null
          ? `${newWalletBalance} créditos · Vence en ${
              walletExpiresInDays >= 60
                ? `${Math.round(walletExpiresInDays / 30)} meses`
                : `${walletExpiresInDays} días`
            }`
          : `${newWalletBalance} créditos`,
    },
  ];

  return (
    <section
      aria-label={t.detailsTitle}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        {t.detailsTitle}
      </h3>
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[160px_1fr] sm:gap-3"
          >
            <dt className="text-xs uppercase tracking-wide text-muted-foreground sm:text-sm sm:normal-case">
              {row.label}
            </dt>
            <dd className="text-sm text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
