import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/**
 * Lightweight copyable code block matching the visual treatment of DSCode
 * but usable inside responsive subsections without the full spec heading.
 */
export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success("Código copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        aria-label="Copiar código"
        className="absolute top-2 right-2 h-8 w-8 p-0 text-[#DBEC62] hover:bg-white/10"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      <div className="bg-lm-black rounded-card p-4 pr-12 overflow-x-auto">
        <pre className="text-xs text-[#DBEC62] leading-relaxed">
          <code data-lang={language}>{code}</code>
        </pre>
      </div>
    </div>
  );
}

interface SubsectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Subsection({ id, title, description, children }: SubsectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-32">
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-4">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

interface PreviewBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function PreviewBox({ children, className = "" }: PreviewBoxProps) {
  return (
    <div className={`bg-card border border-border rounded-card p-4 md:p-6 my-3 ${className}`}>
      {children}
    </div>
  );
}
