import { Badge } from "@/components/ui/badge";

export type LicenseStatus = "vigente" | "consumida" | "expirada" | "anulada";

const map: Record<LicenseStatus, { variant: "vigente" | "consumida" | "expirada" | "destructive"; label: string }> = {
  vigente:   { variant: "vigente",     label: "Vigente"   },
  consumida: { variant: "consumida",   label: "Consumida" },
  expirada:  { variant: "expirada",    label: "Expirada"  },
  anulada:   { variant: "destructive", label: "Anulada"   },
};

export function LicenseBadge({ status }: { status: LicenseStatus }) {
  const m = map[status];
  return <Badge variant={m.variant}>{m.label}</Badge>;
}
