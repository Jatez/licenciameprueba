import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/modules/admin";
import { Button } from "@/components/ui/button";
import {
  AuditFilters,
  AuditStats,
  AuditTimelineTable,
  AuditEventSheet,
  auditStrings,
  useAdminAudit,
  type AuditEvent,
} from "@/modules/admin/audit";

/**
 * F-09 · /admin/audit — chronological log of sensitive admin actions.
 * 100% UI demo. No backend, no persistence.
 */
export default function AdminAudit() {
  const { filtered, filters, setFilters, resetFilters, markReviewed, stats, events } =
    useAdminAudit();
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const t = auditStrings.page;

  return (
    <>
      <AdminPageTitle
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button
            variant="secondary"
            onClick={() => toast.info(t.exportToast)}
            aria-label={t.exportCta}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.exportCta}
          </Button>
        }
      />

      <div className="space-y-6">
        <AuditStats stats={stats} />
        <AuditFilters
          value={filters}
          onChange={setFilters}
          onReset={resetFilters}
          shown={filtered.length}
          total={events.length}
        />
        <AuditTimelineTable events={filtered} onSelect={setSelected} />
      </div>

      <AuditEventSheet
        event={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onMarkReviewed={(id) => {
          markReviewed(id);
          setSelected((prev) => (prev ? { ...prev, reviewed: true } : prev));
        }}
      />
    </>
  );
}
