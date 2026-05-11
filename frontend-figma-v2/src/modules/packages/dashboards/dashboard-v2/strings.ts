/**
 * Localized strings for dashboard V2.
 * Spanish copy lives here so future i18n is a one-file swap.
 */
export const dashboardV2Strings = {
  header: {
    title: "Dashboard",
    subtitle: "Tu música, licencias y métricas en un vistazo",
    lastUpdated: "Actualizado {time}",
    lastUpdatedStale: "Datos posiblemente desactualizados",
    refresh: "Actualizar",
    periodAriaLabel: "Período de análisis",
    export: "Exportar",
    exportPdf: "Exportar PDF",
    exportExcel: "Exportar Excel",
    exportComingSoon: "Exportación disponible próximamente",
  },
  periods: {
    "7d": "Últimos 7 días",
    "30d": "Últimos 30 días",
    "90d": "Últimos 90 días",
    ytd: "Este año",
    custom: "Personalizado",
  },
  kpis: {
    balance: { label: "Saldo de créditos", unit: "créditos disponibles", cta: "Comprar créditos" },
    "active-licenses": { label: "Licencias activas", unit: "licencias en vigencia", cta: "Ver licencias" },
    "tracked-posts": { label: "Publicaciones rastreadas", unit: "publicaciones detectadas", cta: "Ver métricas" },
    "bag-validity": { label: "Vigencia de bolsa", unit: "días restantes", cta: "Extender bolsa" },
  },
  wallet: {
    title: "Tu billetera",
    balanceOf: "{balance} de {total} créditos",
    expiresOn: "Vence el {date}",
    noBag: "Sin bolsa activa",
    cta: "Recargar wallet",
    history: "Ver historial de compras",
  },
  creditUsage: {
    title: "Consumo de créditos",
    subtitle: "Por tipo de uso",
    periodTotal: "Total del período: {total} créditos",
    vsPreviousPeriod: "vs período anterior: {delta}",
    empty: "Sin consumo en este período",
    usageTypes: {
      "single-use": "Uso único",
      "stories-pack": "Paquete stories",
      "monthly-extended": "Uso extendido mensual",
      "long-video": "Video largo",
      "paid-post": "Post con pauta",
      "collaborative-post": "Post colaborativo",
    } as Record<string, string>,
  },
  topTracks: {
    title: "Top canciones por rendimiento",
    subtitle: "Ranking del período actual",
    licenseSingular: "{count} licencia",
    licensePlural: "{count} licencias",
    impressionsLabel: "{count} impresiones",
    creditsLabel: "{count} créditos",
    sortLabel: "Ordenar canciones por",
    sortByLicenses: "Por licencias",
    sortByImpressions: "Por impresiones",
    sortByCredits: "Por créditos consumidos",
    viewAll: "Ver catálogo completo",
    empty: "Aún no has licenciado canciones",
    emptyDescription: "Cuando emitas licencias, las canciones más usadas aparecerán aquí.",
    emptyCta: "Explorar catálogo",
    rowAriaLabel: "Posición {position}: {title} de {artist}, {metric}",
  },
  platformBreakdown: {
    title: "Rendimiento por red social",
    postSingular: "{count} publicación",
    postPlural: "{count} publicaciones",
    notConnected: "No conectado",
    connect: "Conectar {platform}",
  },
  recentActivity: {
    title: "Actividad reciente",
    viewAll: "Ver toda la actividad →",
    empty: "Tu actividad aparecerá aquí cuando empieces a operar",
    viewDetails: "Ver",
    filters: {
      all: "Todas",
      licenses: "Licencias",
      credits: "Créditos",
      connections: "Conexiones",
      catalog: "Catálogo",
      reports: "Reportes",
    },
    emptyTitle: "Sin actividad reciente",
    emptyDescription: "Las acciones que realices aparecerán aquí",
    emptyCta: "Explora el catálogo",
    groupLabels: {
      seconds: "Hace unos segundos",
      today: "Hoy",
      yesterday: "Ayer",
      thisWeek: "Esta semana",
      earlier: "Anterior",
    },
    actions: {
      view: "Ver",
      review: "Revisar",
      buy: "Comprar",
    },
  },
  alerts: {
    viewMoreSingular: "Ver {count} alerta más",
    viewMorePlural: "Ver {count} alertas más",
    dismiss: "Cerrar alerta",
  },
  emptyDashboard: {
    greeting: "Hola, {companyName} 👋",
    title: "Tu dashboard cobrará vida en 3 pasos",
    subtitle:
      "Cuando empieces a licenciar, aquí verás tus métricas, alertas y actividad en tiempo real.",
    steps: {
      buyCredits: {
        title: "Compra tus primeros créditos",
        description: "Elige la bolsa que mejor se adapte a tu operación",
        cta: "Ver paquetes",
      },
      exploreCatalog: {
        title: "Explora el catálogo",
        description: "Más de 15.000 canciones listas para licenciar",
        cta: "Ver catálogo",
      },
      connectSocial: {
        title: "Conecta tus redes sociales",
        description: "Para trackeo automático de publicaciones",
        cta: "Conectar redes",
      },
    },
  },
  errorState: {
    title: "No pudimos cargar tu dashboard",
    message: "Intenta de nuevo en unos segundos.",
    cta: "Reintentar",
  },
  widgetError: {
    title: "Error al cargar",
    cta: "Reintentar",
  },
};

/** Naive plural helper (count) → singular vs plural. Avoids intl-messageformat. */
export function plural(template: { one: string; other: string }, count: number): string {
  return (count === 1 ? template.one : template.other).replace("{count}", String(count));
}

/** Replace {key} placeholders with values. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
