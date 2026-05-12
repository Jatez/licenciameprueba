/**
 * F-11 · Strings (es-CO). Listo para i18n sin reescribir consumidores.
 */
import type { LicenseUseType, PeriodPreset, SocialPlatform, PublicationSyncStatus } from "./types";

export const metricsStrings = {
  module: {
    name: "Métricas",
    description: "Analítica y exportación de reportes.",
  },
  routes: {
    overview: "Métricas",
    publicationDetail: "Detalle de publicación",
    reportsHistory: "Historial de reportes",
  },
  placeholders: {
    publicationDetail: "F-11 · Detalle de publicación — pendiente",
    reportsHistory: "F-11 · Historial de reportes — pendiente",
  },
  header: {
    title: "Métricas",
    subtitle: "Analiza el rendimiento de tu música licenciada en redes sociales.",
    lastUpdated: "Última actualización:",
    refreshAria: "Actualizar métricas",
    exportButton: "Exportar reporte",
    exportPlaceholderToast:
      "La configuración de reportes se habilitará en el siguiente paso.",
  },
  filters: {
    period: "Período",
    platform: "Plataforma",
    useType: "Tipo de uso",
    syncStatus: "Estado de datos",
    clear: "Limpiar filtros",
    showingResults: "Mostrando {visible} de {total} publicaciones",
    customRangeError: "La fecha inicial debe ser anterior a la final.",
    syncStatusOptions: {
      all: "Todos",
      synced_only: "Solo sincronizados",
      with_issues: "Con incidencias",
    },
  },
  health: {
    staleTitle: "Datos desactualizados",
    staleMessage:
      "Los datos se sincronizaron por última vez {when}. Algunas métricas pueden no estar actualizadas.",
    syncNow: "Sincronizar ahora",
    failedTitle: "Datos incompletos",
    failedMessage:
      "{count} publicaciones tienen datos incompletos por una falla temporal con la red social. Se reintentará automáticamente.",
    seeIssues: "Ver detalles",
    combinedTitle: "Datos parciales y desactualizados",
    combinedMessage:
      "Última sincronización {when}. {count} publicaciones tienen datos incompletos. Se reintentará automáticamente.",
  },
  kpis: {
    publications: {
      label: "Publicaciones",
      tooltip:
        "Total de publicaciones detectadas con música licenciada en el período.",
    },
    views: {
      label: "Reproducciones",
      tooltip:
        "Suma de reproducciones / visualizaciones reportadas por las redes sociales.",
      partialAsterisk:
        "Incluye solo publicaciones con datos confirmados ({synced} de {total}).",
    },
    interactions: {
      label: "Interacciones",
      tooltip: "Likes + comentarios + compartidos + guardados.",
    },
    engagement: {
      label: "Engagement rate",
      tooltip:
        "Interacciones / reproducciones. Mide qué tan involucrada está la audiencia.",
    },
    noChange: "Sin cambio",
    deltaPeriodLabel: "vs período anterior",
  },
  trend: {
    title: "Tendencia",
    seriesPublications: "Publicaciones",
    seriesViews: "Reproducciones",
    emptyTitle: "Sin datos en el período",
    sparseHint: "Pocos datos: las tendencias pueden no ser concluyentes.",
  },
  platforms: {
    title: "Por plataforma",
    publications: "Publicaciones",
    views: "Reproducciones",
    engagement: "Engagement",
    notConnected: "No conectada",
    connect: "Conectar",
  },
  table: {
    title: "Publicaciones detectadas",
    searchPlaceholder: "Buscar por canción, artista o URL…",
    columnsButton: "Columnas",
    caption:
      "Listado de publicaciones detectadas con música licenciada en el período seleccionado.",
    columns: {
      preview: "Pieza",
      track: "Canción",
      platform: "Red",
      date: "Fecha",
      useType: "Tipo de uso",
      views: "Reproducciones",
      interactions: "Interacciones",
      engagement: "Eng.",
      status: "Estado",
      actions: "Acciones",
    },
    pageSize: "Filas por página",
    showingRange: "Mostrando {from}–{to} de {total}",
    openExternal: "Abrir publicación original",
    viewDetail: "Ver detalle",
    rowOpenAria: "Ver detalle de la publicación",
    empty: {
      title: "No hay actividad en este período",
      message:
        "Las publicaciones con música licenciada aparecerán aquí. Prueba ampliando el rango de fechas o revisando otro período.",
      changePeriod: "Cambiar período",
      tutorial: "Ver tutorial",
      tutorialToast: "El tutorial se activará en una versión próxima.",
    },
    syncTooltips: {
      partial: "Datos parciales: faltan reproducciones de esta publicación.",
      failed: "Falla de sincronización con la red social.",
      no_data: "Aún no llegan métricas de esta plataforma.",
      synced: "Datos completos y verificados.",
      syncing: "Sincronizando…",
    },
  },
  topTracksTeaser: {
    title: "Las canciones que más sonaron este período",
    cta: "Ver ranking completo",
    ctaToast: "El ranking completo se habilitará en el siguiente paso.",
  },
  topTracks: {
    title: "Top canciones por rendimiento",
    sortByLabel: "Ordenar por",
    sortBy: {
      views: "Reproducciones",
      interactions: "Interacciones",
      engagement: "Engagement rate",
      publications: "# publicaciones",
    },
    podiumNew: "Nueva",
    rankingHeading: "Resto del ranking",
    metricViews: "reproducciones",
    metricInteractions: "interacciones",
    metricEngagement: "engagement",
    metricPublications: "publicaciones",
    publicationsShort: "pubs",
    showAll: "Mostrar todas ({count} canciones)",
    showAllModalTitle: "Ranking completo de canciones",
    onlyThis: "Ver solo esta canción en la tabla",
    clearTrackFilter: "Quitar filtro de canción",
    activeFilterLabel: "Tabla filtrada por:",
    posUp: "+{n} posiciones vs. período anterior",
    posDown: "{n} posiciones vs. período anterior",
    posSame: "Sin cambio vs. período anterior",
    posNew: "Nueva entrada en el ranking",
  },
  export: {
    drawerTitle: "Exportar reporte",
    drawerSubtitle: "Configura qué incluir y en qué formato.",
    closeAria: "Cerrar configuración de exportación",
    closeWithJobConfirm:
      "Hay un reporte generándose en segundo plano. Lo dejaremos corriendo y te avisaremos cuando esté listo.",
    sections: {
      filters: {
        title: "Período y filtros",
        summaryHint:
          "El reporte se generará con los filtros aplicados arriba. Cambia los filtros antes de exportar si necesitas otro alcance.",
        editFilters: "Editar filtros",
        period: "Período",
        platform: "Plataforma",
        useType: "Tipo de uso",
        syncStatus: "Estado",
        all: "Todos",
        allPlatforms: "Todas las plataformas",
        allUseTypes: "Todos los tipos de uso",
      },
      content: {
        title: "Contenido del reporte",
        legalHint:
          "Para auditorías y revisiones legales, recomendamos incluir todas las secciones.",
        items: {
          executiveSummary: "Resumen ejecutivo",
          executiveSummaryDesc:
            "KPIs del período + comparación vs. anterior + insights clave.",
          licenses: "Detalle de licencias emitidas",
          licensesDesc:
            "ID, fecha, tipo de uso, créditos, estado, track asociado.",
          credits: "Movimientos de créditos",
          creditsDesc: "Compras y consumos del período.",
          publications: "Publicaciones detectadas",
          publicationsDesc:
            "Fecha, plataforma, URL, ID externo, track asociado.",
          metrics: "Métricas de rendimiento",
          metricsDesc: "Reproducciones, interacciones y engagement por publicación.",
          evidence: "Evidencia de uso",
          evidenceDesc:
            "URLs públicas, IDs de plataforma y capturas si están disponibles.",
          topTracks: "Top canciones por rendimiento",
          topTracksDesc: "Ranking del período por reproducciones e interacciones.",
        },
      },
      format: {
        title: "Formato y idioma",
        format: "Formato",
        pdf: "PDF",
        pdfHint: "Ideal para presentar a stakeholders y auditorías. Incluye gráficos.",
        excel: "Excel",
        excelHint:
          "Ideal para análisis posterior. Una hoja por sección con datos crudos.",
        language: "Idioma",
        languageEs: "Español",
        languageEn: "English",
      },
      filename: {
        title: "Nombre del archivo",
        label: "Nombre del archivo",
        helper: "Se sugiere automáticamente según el período seleccionado.",
      },
    },
    cancel: "Cancelar",
    generate: "Generar reporte",
    busyHint: "Ya hay un reporte generándose. Espera a que termine.",
    partialNote:
      "Hay {count} publicaciones con datos parciales en este período. El reporte las marcará como tales.",
    progress: {
      queued: "Encolando…",
      generating: "Generando reporte…",
      etaLabel: "Tiempo estimado",
      etaSeconds: "~{seconds}s",
      cancel: "Cancelar",
      minimize: "Minimizar",
      restore: "Mostrar reporte",
      summaryRows: "{count} publicaciones",
    },
    success: {
      title: "Reporte listo para descargar",
      download: "Descargar",
      viewHistory: "Ver historial",
      starting: "Iniciando descarga…",
      dismiss: "Cerrar",
    },
    failed: {
      title: "No pudimos generar el reporte",
      retry: "Reintentar",
      dismiss: "Cerrar",
    },
  },
  publicationDetail: {
    breadcrumbRoot: "Métricas",
    breadcrumbList: "Publicaciones",
    notFoundTitle: "No encontramos esta publicación",
    notFoundMessage:
      "Es posible que haya sido eliminada de la red social o que el enlace esté caducado.",
    backToMetrics: "Volver a métricas",
    publishedOn: "Publicado el",
    viewOnPlatform: "Ver post en plataforma",
    viewOnPlatformDisabled: "URL no disponible para este post",
    kpis: {
      views: "Reproducciones",
      likes: "Likes",
      comments: "Comentarios",
      shares: "Compartidos",
      saves: "Guardados",
    },
    trendTitle: "Tendencia diaria desde la publicación",
    trendCaption: "Datos simulados a partir de los totales del post.",
    evidenceTitle: "Evidencia legal",
    evidenceFields: {
      licenseId: "ID Licencia",
      useType: "Tipo de uso",
      licenseStatus: "Estado licencia",
      credits: "Créditos gastados",
      externalId: "ID externo del post",
      lastSync: "Última sincronización",
    },
    viewLicense: "Ver licencia",
    downloadEvidence: "Descargar evidencia",
    copyAria: "Copiar {label}",
    copied: "Copiado al portapapeles",
    syncTitle: "Estado de sincronización",
    syncLast: "Última sincronización",
    syncNext: "Próxima programada",
    syncNextValue: "en ~3 h",
    syncIssueTitle: "Problemas con esta sincronización",
    syncRetry: "Reintentar sincronización",
    syncRetryToast: "Sincronización agendada. Volveremos a intentar en unos minutos.",
  },
  reportsHistory: {
    title: "Reportes generados",
    subtitle: "Historial de reportes exportados en los últimos 90 días.",
    newReport: "Generar nuevo reporte",
    columns: {
      date: "Fecha",
      name: "Nombre",
      period: "Período",
      format: "Formato",
      size: "Tamaño",
      status: "Estado",
      actions: "Acciones",
    },
    statusReady: "Listo",
    statusFailed: "Fallido",
    statusCancelled: "Cancelado",
    download: "Descargar",
    actionsAria: "Acciones del reporte",
    regenerate: "Regenerar con la misma configuración",
    viewConfig: "Ver configuración usada",
    deleteEntry: "Eliminar del historial",
    deleted: "Reporte eliminado del historial.",
    downloadStarting: "Iniciando descarga…",
    empty: {
      title: "Aún no has generado reportes",
      message:
        "Cuando exportes tu primer reporte, lo encontrarás aquí con todas sus configuraciones para regenerarlo.",
      cta: "Generar mi primer reporte",
    },
    configModalTitle: "Configuración usada",
    configModalClose: "Cerrar",
  },
} as const;

export const periodPresetLabels: Record<PeriodPreset, string> = {
  last_7_days: "Últimos 7 días",
  last_30_days: "Últimos 30 días",
  last_90_days: "Últimos 90 días",
  this_month: "Este mes",
  last_month: "Mes pasado",
  custom: "Personalizado",
};

export const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export const useTypeLabels: Record<LicenseUseType, string> = {
  "single-use": "Uso único",
  "stories-pack": "Stories",
  "monthly-extended": "Mensual",
  "long-video": "Video largo",
  "paid-post": "Post pagado",
  "collaborative-post": "Colaborativo",
};

export const syncStatusLabels: Record<PublicationSyncStatus, string> = {
  synced: "Sincronizado",
  syncing: "Sincronizando",
  partial: "Parcial",
  failed: "Fallo",
  no_data: "Sin datos",
};
