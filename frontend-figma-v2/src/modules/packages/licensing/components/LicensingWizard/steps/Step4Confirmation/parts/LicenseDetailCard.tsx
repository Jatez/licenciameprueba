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

  const balanceSummary =
    walletExpiresInDays !== null
      ? `${newWalletBalance} créditos · Vence en ${
          walletExpiresInDays >= 60
            ? `${Math.round(walletExpiresInDays / 30)} meses`
            : `${walletExpiresInDays} días`
        }`
      : `${newWalletBalance} créditos`;

  const rows: Array<{ label: string; value: React.ReactNode }> = [
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
      value: balanceSummary,
    },
  ];

  return (
    <section
      aria-label={t.detailsTitle}
      className="rounded-[28px] border border-black/5 bg-white/94 p-4 shadow-[0_20px_44px_rgba(15,23,42,0.06)] sm:p-5"
    >
      <div className="space-y-4">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {t.detailsTitle}
            </h3>
            <Badge variant={STATUS_VARIANT[license.status]}>
              {t.statusLabels[license.status]}
            </Badge>
          </div>

          <div>
            <p className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
              {license.trackSnapshot.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">
              {license.trackSnapshot.artist}
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-muted/40 px-4 py-2.5">
              <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {t.fields.creditsUsed}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCredits(license.creditsConsumed)}
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-muted/40 px-4 py-2.5">
              <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {t.fields.currentBalance}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
                {balanceSummary}
              </p>
            </div>
          </div>
        </div>

        <dl className="grid gap-2.5 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-black/5 bg-white px-4 py-2.5"
          >
            <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-foreground">{row.value}</dd>
          </div>
        ))}
        </dl>
      </div>
    </section>
  );
}
