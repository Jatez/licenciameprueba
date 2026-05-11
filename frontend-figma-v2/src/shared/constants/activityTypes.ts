import {
  Ban,
  Building2,
  Download,
  FileCheck2,
  FileDown,
  Link as LinkIcon,
  Link2,
  ListMusic,
  Star,
  Unlink,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { UserActivityType } from "@/api/types.dashboard";

export type UserActivityCategory =
  | "licenses"
  | "credits"
  | "connections"
  | "catalog"
  | "reports"
  | "company";

export interface UserActivityTypeConfig {
  /** Lucide icon component. */
  icon: LucideIcon;
  /**
   * Tailwind color token (e.g. `lime-400`). Pre-built `bgClass`/`textClass`
   * are also exposed so Tailwind can statically detect the classes.
   */
  color: string;
  /** Full Tailwind class for avatar background (`bg-{color}/15`). */
  bgClass: string;
  /** Full Tailwind class for icon color (`text-{color}`). */
  textClass: string;
  title: string;
  /**
   * Template with `{varName}` placeholders resolved against
   * `UserActivity.payload`. Missing keys render as the literal placeholder.
   */
  descriptionTemplate: string;
  /**
   * Educational copy shown in /activity-history. Explains *what* the event
   * means in plain language — distinct from `descriptionTemplate` which
   * formats individual entries in the feed.
   */
  helpText: string;
  category: UserActivityCategory;
}

export const USER_ACTIVITY_TYPES: Record<UserActivityType, UserActivityTypeConfig> = {
  license_issued: {
    icon: FileCheck2,
    color: "lime-400",
    bgClass: "bg-lime-400/15",
    textClass: "text-lime-400",
    title: "Licencia emitida",
    descriptionTemplate: "{license_code} para “{track_title}”",
    helpText:
      "Generaste una licencia para usar un track. La licencia queda en estado VIGENTE hasta que se publique o expire.",
    category: "licenses",
  },
  certificate_downloaded: {
    icon: FileDown,
    color: "teal-500",
    bgClass: "bg-teal-500/15",
    textClass: "text-teal-500",
    title: "Certificado descargado",
    descriptionTemplate: "Certificado de {license_code}",
    helpText:
      "Descargaste el PDF legal que acredita la licencia. Útil para auditorías y soporte legal.",
    category: "licenses",
  },
  license_url_linked: {
    icon: LinkIcon,
    color: "orange-500",
    bgClass: "bg-orange-500/15",
    textClass: "text-orange-500",
    title: "URL vinculada manualmente",
    descriptionTemplate: "{license_code} en {platform}",
    helpText:
      "Asociaste manualmente una publicación a una licencia cuando el match automático no la detectó.",
    category: "licenses",
  },
  license_voided: {
    icon: Ban,
    color: "red-500",
    bgClass: "bg-red-500/15",
    textClass: "text-red-500",
    title: "Anulación solicitada",
    descriptionTemplate: "{license_code} — {reason}",
    helpText:
      "Solicitaste anular una licencia. Sujeto a la política de anulación vigente.",
    category: "licenses",
  },
  credits_purchased: {
    icon: Wallet,
    color: "emerald-500",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-500",
    title: "Créditos comprados",
    descriptionTemplate: "Bolsa de {credits} créditos",
    helpText: "Activaste un paquete de créditos (Bolsa A, B o C) en tu cuenta empresa.",
    category: "credits",
  },
  social_connected: {
    icon: Link2,
    color: "blue-500",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-500",
    title: "Red social conectada",
    descriptionTemplate: "{platform} {handle}",
    helpText:
      "Vinculaste una cuenta de Instagram, TikTok o Facebook vía OAuth para sincronizar publicaciones.",
    category: "connections",
  },
  social_disconnected: {
    icon: Unlink,
    color: "slate-500",
    bgClass: "bg-slate-500/15",
    textClass: "text-slate-500",
    title: "Cuenta desconectada",
    descriptionTemplate: "{platform} {handle}",
    helpText:
      "Removiste el acceso de una cuenta social. Las licencias previas siguen siendo válidas.",
    category: "connections",
  },
  track_favorited: {
    icon: Star,
    color: "yellow-400",
    bgClass: "bg-yellow-400/15",
    textClass: "text-yellow-400",
    title: "Track guardado",
    descriptionTemplate: "“{track_title}” — {artist}",
    helpText:
      "Marcaste un track como favorito para acceder rápido desde tu biblioteca.",
    category: "catalog",
  },
  playlist_imported: {
    icon: ListMusic,
    color: "violet-500",
    bgClass: "bg-violet-500/15",
    textClass: "text-violet-500",
    title: "Playlist importada",
    descriptionTemplate: "{playlist_name} ({tracks_count} tracks)",
    helpText:
      "Importaste una playlist de Spotify y matcheaste sus tracks contra el catálogo Licénciame.",
    category: "catalog",
  },
  report_exported: {
    icon: Download,
    color: "cyan-500",
    bgClass: "bg-cyan-500/15",
    textClass: "text-cyan-500",
    title: "Reporte exportado",
    descriptionTemplate: "{report_name} en {format}",
    helpText:
      "Generaste un reporte en PDF o Excel con licencias, créditos, publicaciones y métricas.",
    category: "reports",
  },
  company_updated: {
    icon: Building2,
    color: "indigo-500",
    bgClass: "bg-indigo-500/15",
    textClass: "text-indigo-500",
    title: "Empresa actualizada",
    descriptionTemplate: "{field} actualizado",
    helpText:
      "Modificaste datos de facturación, perfil de empresa o información de contacto.",
    category: "company",
  },
};

export type UserActivityFilterKey =
  | "all"
  | "licenses"
  | "credits"
  | "connections"
  | "catalog"
  | "reports";

export const USER_ACTIVITY_FILTERS: { key: UserActivityFilterKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "licenses", label: "Licencias" },
  { key: "credits", label: "Créditos" },
  { key: "connections", label: "Conexiones" },
  { key: "catalog", label: "Catálogo" },
  { key: "reports", label: "Reportes" },
];

/** Human-readable category names + canonical order, used by docs and filter UIs. */
export const USER_ACTIVITY_CATEGORY_LABELS: Record<UserActivityCategory, string> = {
  licenses: "Licenciamiento",
  credits: "Créditos",
  connections: "Conexiones",
  catalog: "Catálogo",
  reports: "Reportes",
  company: "Cuenta",
};

export const USER_ACTIVITY_CATEGORY_ORDER: UserActivityCategory[] = [
  "licenses",
  "credits",
  "connections",
  "catalog",
  "reports",
  "company",
];

export function matchesUserActivityFilter(
  type: UserActivityType,
  filter: UserActivityFilterKey,
): boolean {
  if (filter === "all") return true;
  return USER_ACTIVITY_TYPES[type].category === filter;
}

/** Resolve `{key}` placeholders against payload. Missing values keep the placeholder. */
export function renderActivityDescription(
  type: UserActivityType,
  payload: Record<string, string | number>,
): string {
  const tpl = USER_ACTIVITY_TYPES[type].descriptionTemplate;
  return tpl.replace(/\{(\w+)\}/g, (_, k) =>
    payload[k] !== undefined ? String(payload[k]) : `{${k}}`,
  );
}