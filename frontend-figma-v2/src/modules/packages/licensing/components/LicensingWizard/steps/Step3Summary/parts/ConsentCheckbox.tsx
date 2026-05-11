import { Checkbox } from "@/components/ui/checkbox";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ConsentCheckbox({ checked, onChange, disabled }: Props) {
  const t = licensingStrings.step3.consent;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          disabled={disabled}
          aria-required="true"
          aria-label={t.label}
          className="mt-0.5"
        />
        <span className="text-sm text-foreground">{t.label}</span>
      </label>
    </div>
  );
}
