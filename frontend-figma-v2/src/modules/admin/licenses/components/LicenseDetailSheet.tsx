import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LicenseStatusBadge } from "./LicenseStatusBadge";
import { EvidenceTimeline } from "./EvidenceTimeline";
import { HiddenTrackBanner } from "./HiddenTrackBanner";
import { licensesStrings } from "../strings";
import type { AdminLicense } from "../types";

interface Props {
  license: AdminLicense | null;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return licensesStrings.detail.fields.noExpiry;
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground break-words">{value}</p>
    </div>
  );
}

export function LicenseDetailSheet({ license, onOpenChange }: Props) {
  const t = licensesStrings.detail;
  const open = Boolean(license);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
        aria-describedby="license-detail-description"
      >
        {license && (
          <>
            <SheetHeader>
              <SheetTitle>{t.title}</SheetTitle>
              <SheetDescription id="license-detail-description">
                {t.description}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <LicenseStatusBadge status={license.status} />
                  <span className="text-xs text-muted-foreground font-tnum">
                    {license.tokenId}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{license.trackTitle}</h3>
                <p className="text-sm text-muted-foreground">{license.trackArtist}</p>
              </div>

              {license.trackHidden && license.status === "active" && (
                <HiddenTrackBanner trackId={license.trackId} />
              )}

              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">{t.tabs.summary}</TabsTrigger>
                  <TabsTrigger value="evidence">{t.tabs.evidence}</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-4 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label={t.fields.token}
                      value={<span className="font-tnum">{license.tokenId}</span>}
                    />
                    <Field
                      label={t.fields.isrc}
                      value={<span className="font-tnum">{license.trackIsrc}</span>}
                    />
                    <Field label={t.fields.company} value={license.companyName} />
                    <Field
                      label={t.fields.issuedBy}
                      value={
                        <span>
                          {license.issuedByUserName}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {license.issuedByUserEmail}
                          </span>
                        </span>
                      }
                    />
                    <Field
                      label={t.fields.usage}
                      value={licensesStrings.usageType[license.usageType]}
                    />
                    <Field
                      label={t.fields.credits}
                      value={<span className="font-tnum">{license.creditsConsumed}</span>}
                    />
                    <Field label={t.fields.issuedAt} value={formatDate(license.issuedAt)} />
                    <Field label={t.fields.expiresAt} value={formatDate(license.expiresAt)} />
                    {license.consumedAt && (
                      <Field label={t.fields.consumedAt} value={formatDate(license.consumedAt)} />
                    )}
                    {license.cancelledAt && (
                      <Field label={t.fields.cancelledAt} value={formatDate(license.cancelledAt)} />
                    )}
                  </div>
                  {license.cancellationReason && (
                    <>
                      <Separator />
                      <Field label={t.fields.cancelReason} value={license.cancellationReason} />
                    </>
                  )}
                </TabsContent>

                <TabsContent value="evidence" className="mt-4">
                  <EvidenceTimeline events={license.evidence} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
