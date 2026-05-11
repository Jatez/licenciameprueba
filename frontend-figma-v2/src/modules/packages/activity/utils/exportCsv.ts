import type { UserActivity } from "@/api/types.dashboard";
import { USER_ACTIVITY_TYPES, renderActivityDescription } from "@/shared/constants/activityTypes";
/** Trigger a browser download for an in-memory Blob. */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportActivityCsv(items: UserActivity[]): void {
  const headers = ["fecha", "tipo", "titulo", "descripcion", "actor", "detalle"];
  const rows = items.map((it) => {
    const cfg = USER_ACTIVITY_TYPES[it.type];
    return [
      it.created_at,
      it.type,
      cfg.title,
      renderActivityDescription(it.type, it.payload),
      it.actor.user_name,
      it.detail_url ?? "",
    ]
      .map(escapeCsv)
      .join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const filename = `actividad-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadBlob(blob, filename);
}