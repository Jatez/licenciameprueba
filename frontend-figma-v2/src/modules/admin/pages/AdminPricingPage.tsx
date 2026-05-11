import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AdminPageTitle } from "@/modules/admin";
import { Button } from "@/components/ui/button";
import {
  PackageCard,
  EditPackageDialog,
  CustomPackageDialog,
  adminPricingMocks,
  pricingStrings,
  type PricingPackage,
} from "@/modules/admin/pricing";

export default function AdminPricing() {
  const t = pricingStrings.page;
  const [packages, setPackages] = useState<PricingPackage[]>(adminPricingMocks);
  const [editing, setEditing] = useState<PricingPackage | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  const handleSave = (next: PricingPackage) => {
    setPackages((prev) => prev.map((p) => (p.key === next.key ? next : p)));
  };

  return (
    <>
      <AdminPageTitle
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button onClick={() => setCustomOpen(true)}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t.customCta}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.key} pkg={pkg} onEdit={setEditing} />
        ))}
      </div>

      <EditPackageDialog
        pkg={editing}
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        onSave={handleSave}
      />
      <CustomPackageDialog open={customOpen} onOpenChange={setCustomOpen} />
    </>
  );
}
