import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CompanyStatusBadge } from "./CompanyStatusBadge";
import { companiesStrings } from "../strings";
import type { AdminCompany } from "../types";

interface Props {
  company: AdminCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmtCop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export function CompanyDetailSheet({ company, open, onOpenChange }: Props) {
  const t = companiesStrings.detail;
  if (!company) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <SheetTitle>{company.name}</SheetTitle>
            <CompanyStatusBadge status={company.status} />
          </div>
          <SheetDescription>{t.description}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="summary" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="summary">{t.tabs.summary}</TabsTrigger>
            <TabsTrigger value="wallet">{t.tabs.wallet}</TabsTrigger>
            <TabsTrigger value="licenses">{t.tabs.licenses}</TabsTrigger>
            <TabsTrigger value="payments">{t.tabs.payments}</TabsTrigger>
            <TabsTrigger value="users">{t.tabs.users}</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4 space-y-3">
            <Field label={t.summary.legalName} value={company.legalName} />
            <Field label={t.summary.taxId} value={company.taxId} />
            <Field label={t.summary.industry} value={company.industry} />
            <Field label={t.summary.city} value={company.city} />
            <Field label={t.summary.joinedAt} value={fmtDate(company.joinedAt)} />
            <Field
              label={t.summary.primaryContact}
              value={`${company.primaryContactName} · ${company.primaryContactEmail}`}
            />
            <Field label={t.summary.monthlySpend} value={fmtCop(company.monthlySpendCop)} />
          </TabsContent>

          <TabsContent value="wallet" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <WalletStat label={t.wallet.available} value={company.wallet.creditsAvailable.toLocaleString("es-CO")} highlight />
              <WalletStat label={t.wallet.consumed} value={company.wallet.creditsConsumed.toLocaleString("es-CO")} />
              <WalletStat label={t.wallet.total} value={company.wallet.creditsTotal.toLocaleString("es-CO")} />
              <WalletStat label={t.wallet.expiresAt} value={fmtDate(company.wallet.expiresAt)} />
              <WalletStat label={t.wallet.lastTopUp} value={fmtDate(company.wallet.lastTopUpAt)} />
              <WalletStat label="Plan" value={company.planLabel} />
            </div>
          </TabsContent>

          <TabsContent value="licenses" className="mt-4">
            {company.licenses.length === 0 ? (
              <Empty msg={t.licenses.empty} />
            ) : (
              <SimpleTable
                headers={[t.licenses.headers.track, t.licenses.headers.status, t.licenses.headers.issuedAt]}
                rows={company.licenses.map((l) => [
                  <div key="t">
                    <p className="text-sm font-medium text-foreground">{l.trackTitle}</p>
                    <p className="text-xs text-muted-foreground">{l.trackArtist}</p>
                  </div>,
                  <Badge
                    key="s"
                    variant={l.status === "active" ? "vigente" : l.status === "consumed" ? "consumida" : "expirada"}
                  >
                    {l.status === "active" ? "Vigente" : l.status === "consumed" ? "Consumida" : "Expirada"}
                  </Badge>,
                  <span key="d" className="text-xs text-muted-foreground font-tnum">{fmtDate(l.issuedAt)}</span>,
                ])}
              />
            )}
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            {company.payments.length === 0 ? (
              <Empty msg={t.payments.empty} />
            ) : (
              <SimpleTable
                headers={[
                  t.payments.headers.invoice,
                  t.payments.headers.amount,
                  t.payments.headers.status,
                  t.payments.headers.date,
                ]}
                rows={company.payments.map((p) => [
                  <span key="i" className="font-tnum text-sm text-foreground">{p.invoiceNumber}</span>,
                  <span key="a" className="font-tnum text-sm text-foreground">{fmtCop(p.amountCop)}</span>,
                  <Badge
                    key="s"
                    variant={p.status === "paid" ? "vigente" : p.status === "pending" ? "pendiente" : "expirada"}
                  >
                    {p.status === "paid" ? "Pagada" : p.status === "pending" ? "Pendiente" : "Fallida"}
                  </Badge>,
                  <span key="d" className="text-xs text-muted-foreground font-tnum">{fmtDate(p.createdAt)}</span>,
                ])}
              />
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            {company.users.length === 0 ? (
              <Empty msg={t.users.empty} />
            ) : (
              <SimpleTable
                headers={[
                  t.users.headers.name,
                  t.users.headers.email,
                  t.users.headers.role,
                  t.users.headers.status,
                ]}
                rows={company.users.map((u) => [
                  <span key="n" className="text-sm font-medium text-foreground">{u.fullName}</span>,
                  <span key="e" className="text-xs text-muted-foreground">{u.email}</span>,
                  <span key="r" className="text-xs text-foreground">{t.users.role[u.role]}</span>,
                  <Badge
                    key="s"
                    variant={u.status === "active" ? "vigente" : u.status === "pending_mfa" ? "pendiente" : "expirada"}
                  >
                    {t.users.status[u.status]}
                  </Badge>,
                ])}
              />
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-border pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm text-foreground">{value}</span>
    </div>
  );
}

function WalletStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-primary/40 bg-primary/10" : "border-border bg-muted/30"}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-tnum text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-t border-border">
              {cells.map((c, j) => (
                <td key={j} className="px-3 py-2 align-middle">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
