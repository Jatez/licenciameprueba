import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DSComponentNameProps {
  name: string;
  className?: string;
}

/**
 * Pill copiable que muestra el nombre canónico del componente del Design System.
 * Click → copia al portapapeles + toast.
 */
export function DSComponentName({ name, className }: DSComponentNameProps) {
  const { t } = useTranslation("designSystem");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(name).then(() => {
      setCopied(true);
      toast.success(t("componentName.copied", { name }));
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={t("actions.copyComponentName")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-lm-gray-100 px-2.5 py-1",
        "font-mono text-xs text-lm-gray-900 transition-colors hover:bg-lm-gray-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      <span>{name}</span>
      {copied ? (
        <Check className="h-3 w-3" aria-hidden="true" />
      ) : (
        <Copy className="h-3 w-3 opacity-60" aria-hidden="true" />
      )}
    </button>
  );
}
