import {
  Download,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportStatusBadge } from "./ReportStatusBadge";
import { useFormatDate } from "@/shared/format";
import {
  metricsStrings,
  periodPresetLabels,
} from "@/modules/monitoring/metrics/strings";
import type { ReportJob } from "@/modules/monitoring/metrics/types";

export interface ReportsHistoryTableProps {
  jobs: ReportJob[];
  onDownload: (job: ReportJob) => void;
  onRegenerate: (job: ReportJob) => void;
  onViewConfig: (job: ReportJob) => void;
  onDelete: (job: ReportJob) => void;
}

export function ReportsHistoryTable({
  jobs,
  onDownload,
  onRegenerate,
  onViewConfig,
  onDelete,
}: ReportsHistoryTableProps) {
  const t = metricsStrings.reportsHistory;
  const { longWithTime } = useFormatDate();
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.columns.date}</TableHead>
            <TableHead>{t.columns.name}</TableHead>
            <TableHead>{t.columns.period}</TableHead>
            <TableHead>{t.columns.format}</TableHead>
            <TableHead className="text-right">{t.columns.size}</TableHead>
            <TableHead>{t.columns.status}</TableHead>
            <TableHead className="text-right">{t.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-tnum text-xs text-foreground/80">
                {longWithTime(job.createdAt)}
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium text-foreground">{job.config.fileName}</p>
                <p className="text-[11px] text-foreground/50">{job.id}</p>
              </TableCell>
              <TableCell className="text-xs text-foreground/70">
                {periodPresetLabels[job.config.filter.period]}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                  {job.config.format === "pdf" ? (
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {job.config.format.toUpperCase()}
                </span>
              </TableCell>
              <TableCell className="font-tnum text-right text-xs text-foreground/80">
                {job.fileSize ?? "—"}
              </TableCell>
              <TableCell>
                <ReportStatusBadge job={job} />
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-1">
                  {job.status === "ready" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(job)}
                      className="h-8 gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.download}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t.actionsAria}
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => onRegenerate(job)}>
                        {t.regenerate}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewConfig(job)}>
                        {t.viewConfig}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(job)}
                        className="text-destructive focus:text-destructive"
                      >
                        {t.deleteEntry}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}