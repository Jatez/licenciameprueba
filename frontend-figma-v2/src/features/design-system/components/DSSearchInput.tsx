import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DSSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DSSearchInput({ value, onChange }: DSSearchInputProps) {
  const { t } = useTranslation("designSystem");
  return (
    <div className="relative hidden md:block">
      <Search
        className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-lm-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("page.searchPlaceholder")}
        aria-label={t("page.searchAriaLabel")}
        className="h-8 w-56 rounded-md border border-lm-gray-300 bg-surface pl-8 pr-3 text-sm text-foreground placeholder:text-lm-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:border-primary"
      />
    </div>
  );
}
