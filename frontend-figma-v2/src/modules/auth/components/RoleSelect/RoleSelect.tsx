import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authStrings } from "../../strings";

const ROLES = ["company_admin", "manager", "creator", "auditor"] as const;
export type RegistrableRole = (typeof ROLES)[number];

export interface RoleSelectProps {
  value?: RegistrableRole;
  onChange: (value: RegistrableRole) => void;
  onBlur?: () => void;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function RoleSelect({
  value,
  onChange,
  onBlur,
  disabled,
  id,
  ...aria
}: RoleSelectProps) {
  const labels = authStrings.register.fields.role.options;
  return (
    <Select value={value} onValueChange={(v) => onChange(v as RegistrableRole)} disabled={disabled}>
      <SelectTrigger
        id={id}
        onBlur={onBlur}
        aria-invalid={aria["aria-invalid"]}
        aria-describedby={aria["aria-describedby"]}
      >
        <SelectValue placeholder={authStrings.register.fields.role.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {labels[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
