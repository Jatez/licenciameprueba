/**
 * UI strings (Spanish) for the admin Audit module. Code stays in English.
 */
export const auditStrings = {
  page: {
    title: "Auditoría",
    subtitle:
      "Bitácora cronológica de acciones administrativas sensibles. Toda actividad queda registrada para fines legales y de cumplimiento.",
    exportCta: "Exportar bitácora",
    exportToast: "Demo: la exportación se conectará al backend.",
  },
  stats: {
    today: { label: "Eventos hoy", caption: "Actividad registrada en las últimas 24h." },
    critical: { label: "Críticos · 7d", caption: "Eventos que requieren revisión legal." },
    actors: { label: "Actores únicos", caption: "Personas y servicios con actividad reciente." },
    unreviewed: { label: "Sin revisar", caption: "Eventos pendientes de marcar como revisados." },
  },
  filters: {
    searchPlaceholder: "Buscar por actor, recurso o ID…",
    severity: "Severidad",
    module: "Módulo",
    range: "Rango",
    onlyCritical: "Solo críticas",
    onlyUnreviewed: "Sin revisar",
    allSeverities: "Todas las severidades",
    allModules: "Todos los módulos",
    clear: "Limpiar",
    counter: (shown: number, total: number) => `${shown} de ${total} eventos`,
    ranges: {
      "24h": "Últimas 24h",
      "7d": "Últimos 7 días",
      "30d": "Últimos 30 días",
      all: "Todo el histórico",
    },
  },
  severity: {
    info: "Info",
    warning: "Advertencia",
    critical: "Crítica",
    success: "Éxito",
  },
  module: {
    catalog: "Catálogo",
    companies: "Empresas",
    billing: "Facturación",
    licenses: "Licencias",
    access: "Accesos",
    pricing: "Precios",
    auth: "Autenticación",
    system: "Sistema",
  },
  actorType: {
    super_admin: "Super Admin",
    system: "Sistema",
  },
  table: {
    headers: {
      timestamp: "Fecha",
      severity: "Severidad",
      action: "Acción",
      actor: "Actor",
      resource: "Recurso",
      ip: "IP",
      detail: "Detalle",
    },
    empty: "No hay eventos que coincidan con los filtros.",
    rowAriaLabel: "Ver detalle del evento",
  },
  detail: {
    title: "Detalle del evento",
    description: "Información técnica completa para revisión y trazabilidad.",
    sections: {
      summary: "Resumen",
      diff: "Cambios aplicados",
      diffEmpty: "Este evento no registró cambios de campos.",
      session: "Contexto de sesión",
      notes: "Notas",
    },
    fields: {
      eventId: "ID de evento",
      timestamp: "Fecha y hora",
      module: "Módulo",
      action: "Acción",
      actor: "Actor",
      resource: "Recurso afectado",
      ip: "Dirección IP",
      userAgent: "User Agent",
      sessionId: "Sesión",
      before: "Antes",
      after: "Después",
    },
    actions: {
      markReviewed: "Marcar como revisada",
      alreadyReviewed: "Revisada",
      markedToast: "Evento marcado como revisado (demo).",
    },
  },
  criticalBanner: {
    title: "Acción crítica",
    body: "Este evento puede tener implicaciones legales o financieras. Revisa el contexto antes de cerrar.",
  },
} as const;
