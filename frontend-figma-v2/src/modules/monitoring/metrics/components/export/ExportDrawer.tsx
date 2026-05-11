/**
 * F-11 · Export drawer.
 *
 * Layout: right-side <Sheet>, ~480px desktop, full-width mobile.
 * Sections: filters summary · content (template) · format & language · filename.
 *
 * Behavior:
 *  - All content checkboxes default to true (legal-by-default).
 *  - Filename auto-suggested but editable; extension follows format.
 *  - "Generar" disabled when an active job is in flight.
 *  - Closes drawer immediately on submit; the persistent toast takes over.
 */
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { metricsStrings, periodPresetLabels } from "../../strings";
import { interpolateString } from "../../utils";
import { useExportStore } from "../../stores/exportStore";
import {
  suggestExportFilename,
  changeFilenameExtension,
} from "./exportFilenameUtil";
import type {
  MetricsFilter,
  ReportConfig,
  ReportContent,
  ReportFormat,
} from "../../types";

interface ExportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: MetricsFilter;
  /** Optional: number of partial publications in current scope, for the warning hint. */
  partialCount?: number;
  /** Pre-fill (for "Regenerate with same configuration"). */
  initialConfig?: Partial<ReportConfig>;
  /** Called when user clicks "Editar filtros" — drawer closes & focus returns to filter bar. */
  onEditFilters?: () => void;
}

const DEFAULT_CONTENT: ReportContent = {
  includeExecutiveSummary: true,
  includeLicenses: true,
  includeCreditsMovement: true,
  includePublications: true,
  includeMetrics: true,
  includeEvidence: true,
  includeTopTracks: true,
};

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-foreground/5 first:border-t-0">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-left">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-foreground/60 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function ExportDrawer({
  open,
  onOpenChange,
  filter,
  partialCount = 0,
  initialConfig,
  onEditFilters,
}: ExportDrawerProps) {
  const activeJob = useExportStore((s) => s.activeJob);
  const startExport = useExportStore((s) => s.startExport);

  const [format, setFormat] = useState<ReportFormat>(initialConfig?.format ?? "pdf");
  const [language, setLanguage] = useState<"es" | "en">(initialConfig?.language ?? "es");
  const [content, setContent] = useState<ReportContent>(
    initialConfig?.content ?? DEFAULT_CONTENT,
  );
  const [fileName, setFileName] = useState<string>(
    initialConfig?.fileName ?? suggestExportFilename(filter, format),
  );

  // Re-suggest filename when filter or format change AND user hasn't custom-edited.
  const [filenameTouched, setFilenameTouched] = useState(false);
  useEffect(() => {
    if (filenameTouched) {
      setFileName((prev) => changeFilenameExtension(prev, format));
    } else {
      setFileName(suggestExportFilename(filter, format));
    }
  }, [filter, format, filenameTouched]);

  // Reset state when re-opening drawer (and apply initial config).
  useEffect(() => {
    if (!open) return;
    setFormat(initialConfig?.format ?? "pdf");
    setLanguage(initialConfig?.language ?? "es");
    setContent(initialConfig?.content ?? DEFAULT_CONTENT);
    setFileName(
      initialConfig?.fileName ??
        suggestExportFilename(filter, initialConfig?.format ?? "pdf"),
    );
    setFilenameTouched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isBusy =
    activeJob !== null &&
    (activeJob.status === "queued" || activeJob.status === "generating");

  const filtersSummary = useMemo(() => {
    const period = periodPresetLabels[filter.period];
    const platforms =
      filter.platforms.length === 0
        ? metricsStrings.export.sections.filters.allPlatforms
        : filter.platforms.join(", ");
    const useTypes =
      filter.useTypes.length === 0
        ? metricsStrings.export.sections.filters.allUseTypes
        : filter.useTypes.join(", ");
    return `${period} · ${platforms} · ${useTypes}`;
  }, [filter]);

  const handleSubmit = () => {
    if (isBusy) return;
    const config: ReportConfig = {
      filter,
      format,
      content,
      language,
      fileName,
    };
    startExport(config);
    onOpenChange(false);
  };

  const t = metricsStrings.export;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
      >
        <SheetHeader className="space-y-1 border-b border-foreground/5 px-6 py-4 text-left">
          <SheetTitle className="text-lg">{t.drawerTitle}</SheetTitle>
          <SheetDescription className="text-xs">{t.drawerSubtitle}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {/* Section 1 — Filters summary */}
          <Section title={t.sections.filters.title}>
            <p className="text-sm text-foreground">{filtersSummary}</p>
            <p className="mt-2 text-xs text-foreground/60">
              {t.sections.filters.summaryHint}
            </p>
            {onEditFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  onOpenChange(false);
                  onEditFilters();
                }}
              >
                {t.sections.filters.editFilters}
              </Button>
            )}
            {partialCount > 0 && (
              <p className="mt-3 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                {interpolateString(t.partialNote, { count: partialCount })}
              </p>
            )}
          </Section>

          {/* Section 2 — Content (template) */}
          <Section title={t.sections.content.title}>
            <ul className="flex flex-col gap-2">
              {(
                [
                  ["includeExecutiveSummary", "executiveSummary", "executiveSummaryDesc"],
                  ["includeLicenses", "licenses", "licensesDesc"],
                  ["includeCreditsMovement", "credits", "creditsDesc"],
                  ["includePublications", "publications", "publicationsDesc"],
                  ["includeMetrics", "metrics", "metricsDesc"],
                  ["includeEvidence", "evidence", "evidenceDesc"],
                  ["includeTopTracks", "topTracks", "topTracksDesc"],
                ] as const
              ).map(([key, labelKey, descKey]) => {
                const checked = content[key];
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-foreground/[0.03]">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) =>
                          setContent((prev) => ({ ...prev, [key]: v === true }))
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {t.sections.content.items[labelKey]}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {t.sections.content.items[descKey]}
                        </p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs italic text-foreground/60">
              {t.sections.content.legalHint}
            </p>
          </Section>

          {/* Section 3 — Format & language */}
          <Section title={t.sections.format.title}>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-xs">{t.sections.format.format}</Label>
                <RadioGroup
                  value={format}
                  onValueChange={(v) => setFormat(v as ReportFormat)}
                  className="mt-2 flex flex-col gap-2"
                >
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-foreground/10 p-3 hover:bg-foreground/[0.03]">
                    <RadioGroupItem value="pdf" id="fmt-pdf" className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t.sections.format.pdf}</p>
                      <p className="text-xs text-foreground/60">{t.sections.format.pdfHint}</p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-foreground/10 p-3 hover:bg-foreground/[0.03]">
                    <RadioGroupItem value="excel" id="fmt-excel" className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t.sections.format.excel}</p>
                      <p className="text-xs text-foreground/60">{t.sections.format.excelHint}</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="lang-select" className="text-xs">
                  {t.sections.format.language}
                </Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as "es" | "en")}>
                  <SelectTrigger id="lang-select" className="mt-2 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">{t.sections.format.languageEs}</SelectItem>
                    <SelectItem value="en">{t.sections.format.languageEn}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          {/* Section 4 — Filename */}
          <Section title={t.sections.filename.title} defaultOpen={false}>
            <Label htmlFor="filename-input" className="text-xs">
              {t.sections.filename.label}
            </Label>
            <Input
              id="filename-input"
              value={fileName}
              onChange={(e) => {
                setFilenameTouched(true);
                setFileName(e.target.value);
              }}
              className="mt-2 text-sm"
            />
            <p className="mt-2 text-xs text-foreground/60">{t.sections.filename.helper}</p>
          </Section>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-foreground/5 px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <div className="flex flex-col items-end gap-1">
            <Button onClick={handleSubmit} disabled={isBusy || !fileName.trim()}>
              {t.generate}
            </Button>
            {isBusy && (
              <span className="text-[11px] text-foreground/60">{t.busyHint}</span>
            )}
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
