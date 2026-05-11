import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "../CollapsibleSection";
import { Code2 } from "lucide-react";

interface DSCodeProps {
  snippet: string;
  language?: string;
  /** When true, wraps in a CollapsibleSection (closed by default). */
  collapsedByDefault?: boolean;
  /** Max height in px for the scrollable code area. Default 420. */
  maxHeight?: number;
  /** Optional title shown when collapsedByDefault is true. */
  title?: string;
}

export function DSCode({
  snippet,
  language = "tsx",
  collapsedByDefault = false,
  maxHeight = 420,
  title,
}: DSCodeProps) {
  const { t } = useTranslation("designSystem");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      toast.success(t("spec.codeCopied"));
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const codeBlock = (
    <div className="relative bg-lm-black rounded-card overflow-hidden">
      <div className="sticky top-0 z-10 flex justify-end bg-lm-black/90 backdrop-blur-sm px-2 py-1.5">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          aria-label={t("spec.copyCodeAria")}
          className="text-[#DBEC62] hover:text-[#DBEC62] hover:bg-white/10"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="overflow-auto px-4 pb-4 -mt-1" style={{ maxHeight }}>
        <pre className="text-xs text-[#DBEC62]">
          <code data-lang={language}>{snippet}</code>
        </pre>
      </div>
    </div>
  );

  if (collapsedByDefault) {
    return (
      <section className="mt-8">
        <CollapsibleSection
          title={title ?? t("spec.headings.code")}
          icon={Code2}
          defaultOpen={false}
        >
          {codeBlock}
        </CollapsibleSection>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title ?? t("spec.headings.code")}
      </h3>
      {codeBlock}
    </section>
  );
}
