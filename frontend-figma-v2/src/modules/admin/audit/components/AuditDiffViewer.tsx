import { ArrowRight } from "lucide-react";
import { auditStrings } from "../strings";
import type { AuditDiffField } from "../types";

interface Props {
  diff?: AuditDiffField[];
}

function fmt(v: string | number | null) {
  if (v === null) return "—";
  return String(v);
}

export function AuditDiffViewer({ diff }: Props) {
  const t = auditStrings.detail;
  if (!diff || diff.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.sections.diffEmpty}</p>;
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Campo</th>
            <th className="px-3 py-2 text-left">{t.fields.before}</th>
            <th className="px-3 py-2 text-left">{t.fields.after}</th>
          </tr>
        </thead>
        <tbody>
          {diff.map((d) => (
            <tr key={d.field} className="border-t border-border">
              <td className="px-3 py-2 font-medium text-foreground">{d.field}</td>
              <td className="px-3 py-2 font-tnum text-muted-foreground">{fmt(d.before)}</td>
              <td className="px-3 py-2 font-tnum text-foreground">
                <span className="inline-flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  {fmt(d.after)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
