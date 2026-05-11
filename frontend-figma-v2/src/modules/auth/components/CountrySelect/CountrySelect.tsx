import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "../../utils/countries";
import { authStrings } from "../../strings";

export interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function CountrySelect({
  value,
  onChange,
  onBlur,
  disabled,
  id,
  ...aria
}: CountrySelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        onBlur={onBlur}
        aria-invalid={aria["aria-invalid"]}
        aria-describedby={aria["aria-describedby"]}
      >
        <SelectValue placeholder={authStrings.register.fields.countryCode.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="mr-2" aria-hidden="true">
              {c.flag}
            </span>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
