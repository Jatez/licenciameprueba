import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { DevSimulatorControls } from "./DevSimulatorControls";
import { DevForceActions } from "./DevForceActions";
import { DevEventLog } from "./DevEventLog";
import { DevErrorLog } from "./DevErrorLog";
import { useErrorStore } from "@/stores/errorStore";

export function DevTrackingPanel() {
  const open = useTrackingStore((s) => s.devPanelOpen);
  const setOpen = useTrackingStore((s) => s.setDevPanelOpen);
  const errorCount = useErrorStore((s) => s.errors.length);
  const t = trackingStrings.devPanel;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle>{t.title}</SheetTitle>
          <SheetDescription>{t.subtitle}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <Section title={t.sections.controls}>
              <DevSimulatorControls />
            </Section>
            <Section title={t.sections.forceDetection}>
              <DevForceActions kind="detection" />
            </Section>
            <Section title={t.sections.forceErrors}>
              <DevForceActions kind="errors" />
            </Section>
            <Section
              title={`Errores capturados${errorCount > 0 ? ` (${errorCount})` : ""}`}
            >
              <DevErrorLog />
            </Section>
            <Section title={t.sections.eventLog}>
              <DevEventLog />
            </Section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
