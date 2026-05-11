import { useState } from "react";
import { Copy, Download, Loader2, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  generateFullStyleGuide,
  generateHTMLStyleGuide,
  generatePromptTemplate,
} from "@/shared/lib/styleguide-exports";
import { DSSearchInput } from "./DSSearchInput";
import { DSBreadcrumb } from "./DSBreadcrumb";
import brandLogotipo from "@/assets/brand-logotipo.svg";

interface DSTopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  activeId: string;
}

function copy(text: string, label: string, toastTemplate: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(toastTemplate.replace("{{label}}", label));
  });
}

function download(filename: string, content: string, mime: string, label: string, toastTemplate: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(toastTemplate.replace("{{label}}", label));
}

export function DSTopBar({ searchQuery, onSearchChange, onMenuClick, activeId }: DSTopBarProps) {
  const { t } = useTranslation(["designSystem", "common"]);
  const copyTpl = t("designSystem:actions.toastCopied");
  const downloadTpl = t("designSystem:actions.toastDownloaded");
  const [generating, setGenerating] = useState<null | "html" | "md">(null);

  const handleDownload = (kind: "html" | "md") => {
    if (generating) return;
    setGenerating(kind);
    // Defer to next frame so the spinner has time to paint before
    // the (potentially heavy) synchronous string generation blocks the thread.
    requestAnimationFrame(() => {
      try {
        if (kind === "html") {
          download(
            "licenciame-design-system.html",
            generateHTMLStyleGuide(),
            "text/html;charset=utf-8",
            "HTML",
            downloadTpl,
          );
        } else {
          download(
            "licenciame-design-system.md",
            generateFullStyleGuide(),
            "text/markdown;charset=utf-8",
            "Markdown",
            downloadTpl,
          );
        }
      } finally {
        setGenerating(null);
      }
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-card border-b border-border flex items-center justify-between gap-3 px-4 lg:px-6 z-50">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
          aria-label={t("common:actions.openMenu")}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <Link
          to="/dashboard03"
          aria-label={t("common:actions.backToDashboard")}
          className="shrink-0 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <img src={brandLogotipo} alt={t("common:appName")} className="h-5 lg:h-6 w-auto" />
        </Link>
        <div className="hidden sm:block h-5 w-px bg-border shrink-0" aria-hidden="true" />
        <DSBreadcrumb activeId={activeId} />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <DSSearchInput value={searchQuery} onChange={onSearchChange} />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleDownload("html")}
          disabled={generating !== null}
          aria-label={t("designSystem:actions.downloadHtmlAria")}
        >
          {generating === "html" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          )}{" "}
          <span className="hidden sm:inline">{t("designSystem:actions.downloadHtml")}</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleDownload("md")}
          disabled={generating !== null}
          aria-label={t("designSystem:actions.downloadMarkdownAria")}
        >
          {generating === "md" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          )}{" "}
          <span className="hidden sm:inline">{t("designSystem:actions.downloadMarkdown")}</span>
        </Button>
        <Button
          size="sm"
          onClick={() => copy(generatePromptTemplate(), "Prompt Template", copyTpl)}
          aria-label={t("designSystem:actions.copyPromptAria")}
        >
          <Copy className="h-3.5 w-3.5" />{" "}
          <span className="hidden sm:inline">{t("designSystem:actions.copyPrompt")}</span>
        </Button>
      </div>
    </header>
  );
}
