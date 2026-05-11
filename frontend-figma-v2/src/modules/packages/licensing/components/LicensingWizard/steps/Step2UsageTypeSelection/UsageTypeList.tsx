import { RadioGroup } from "@/components/ui/radio-group";
import type { LicenseUsageType } from "@/api/types";
import type { UsageTypeCardViewModel } from "@/modules/packages/licensing/types";
import { UsageTypeCard } from "./UsageTypeCard";

interface Props {
  items: UsageTypeCardViewModel[];
  value: LicenseUsageType | null;
  onChange: (value: LicenseUsageType) => void;
}

export function UsageTypeList({ items, value, onChange }: Props) {
  return (
    <RadioGroup
      value={value ?? ""}
      onValueChange={(v) => onChange(v as LicenseUsageType)}
      className="grid gap-3 lg:grid-cols-2"
    >
      {items.map((item) => (
        <UsageTypeCard key={item.id} vm={item} />
      ))}
    </RadioGroup>
  );
}
