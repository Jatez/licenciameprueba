import type { License } from "@/api/types";
import { useLicensingTerms } from "@/modules/packages/licensing/hooks/useLicensingTerms";
import { useWalletBalance } from "@/modules/packages/licensing/hooks/useWalletBalance";
import { useLicensingWizardStore } from "@/stores/licensingWizardStore";
import { ConfirmationSuccessBanner } from "./parts/ConfirmationSuccessBanner";
import { LicenseDetailCard } from "./parts/LicenseDetailCard";
import { CertificateActions } from "./parts/CertificateActions";
import { NextStepsBlock } from "./parts/NextStepsBlock";
import { PostLicensingActions } from "./parts/PostLicensingActions";

interface Props {
  license: License;
}

export function Step4Confirmation({ license }: Props) {
  const wallet = useWalletBalance();
  const terms = useLicensingTerms();
  const reset = useLicensingWizardStore((s) => s.reset);

  // Reset wizard state when navigating away to any post-licensing destination.
  const handleLeave = () => {
    reset();
  };

  // Wallet is fetched freshly on the confirmation screen — but the truthful
  // post-transaction balance we got from the issue response is held in
  // `license.creditsConsumed`. Compute new balance from current wallet snapshot
  // (already reflects the deduction in mock; in production backend will
  // invalidate the wallet query before this screen renders).
  const newBalance = Math.max(0, wallet.balance);

  return (
    <div className="flex flex-col gap-5">
      <ConfirmationSuccessBanner licenseTokenId={license.licenseTokenId} />
      <LicenseDetailCard
        license={license}
        newWalletBalance={newBalance}
        walletExpiresInDays={wallet.daysUntilExpiry}
      />
      <CertificateActions license={license} terms={terms.data} />
      <NextStepsBlock onLeave={handleLeave} />
      <PostLicensingActions onLeave={handleLeave} />
    </div>
  );
}
