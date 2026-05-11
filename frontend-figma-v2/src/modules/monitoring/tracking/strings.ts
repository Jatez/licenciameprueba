/**
 * Tracking-feature strings. UI in Spanish, code in English.
 */
export const trackingStrings = {
  detectionToast: {
    title: "Nueva publicación detectada",
    matchedMessage: '"{trackTitle}" por {artist} · Matcheó con {licenseId}',
    noMatchMessage: '"{trackTitle}" por {artist} · Sin licencia asociada',
    viewAction: "Ver publicación",
    dismiss: "Cerrar",
  },
  syncStatus: {
    healthy: "Tracking activo",
    degraded: "Sincronización parcial",
    unavailable: "Sincronización no disponible",
    lastSync: "Última sincronización: hace {duration}",
    nextSync: "Próxima sincronización en {duration}",
    platformError: {
      rate_limited: "Rate limit alcanzado en {platform}",
      token_expired: "Autorización expirada en {platform}",
      no_accounts: "Sin cuentas conectadas en {platform}",
      error: "Error en {platform}",
    },
    platformOk: "Tracking activo en {platform}",
    manualSync: "Sincronizar ahora",
    manualSyncRunning: "Sincronizando…",
    manualSyncSuccess: "Sincronización iniciada — recibirás actualizaciones en unos minutos.",
    manualSyncError: "No pudimos iniciar la sincronización. Intenta de nuevo.",
    goToSocialAccounts: "Ir a redes sociales",
    platformLabels: {
      instagram: "Instagram",
      tiktok: "TikTok",
      facebook: "Facebook",
    },
  },
  monitoring: {
    title: "Monitoreo",
    subtitle: "Sigue el rastro de tus publicaciones con música licenciada",
    aggregates: {
      all: "Todas",
      pendingMatch: "Pendientes",
      matchedAuto: "Auto-match",
      matchedManual: "Manual",
      noMatchFound: "Sin match",
    },
    toolbar: {
      filterStatus: "Estado",
      filterPlatforms: "Plataformas",
      filterDateRange: "Fechas",
      manualLinkCta: "Cargar publicación manual",
      filterStatusOptions: {
        all: "Todas",
        "pending-match": "Pendientes",
        "matched-auto": "Auto-match",
        "matched-manual": "Manual",
        "no-match-found": "Sin match",
        unlinked: "Desvinculado",
      },
    },
    filters: {
      dateRange: {
        today: "Hoy",
        last7: "Últimos 7 días",
        last30: "Últimos 30 días",
        last90: "Últimos 90 días",
        custom: "Personalizado",
      },
      allPlatforms: "Todas las plataformas",
      platformsCount: "{count} plataformas",
    },
    empty: {
      noSocialAccounts: {
        title: "Conecta tus redes sociales",
        message:
          "Para empezar a trackear publicaciones, conecta al menos una red social.",
        cta: "Conectar redes",
      },
      noDetections: {
        title: "Aún no detectamos publicaciones",
        message:
          "Publica contenido con música licenciada en tus redes conectadas. Detectamos automáticamente en unos minutos.",
        primaryCta: "Ir al catálogo",
        secondaryCta: "Cargar publicación manual",
      },
      noResults: {
        title: "Ninguna detección coincide con tus filtros",
        message: "Prueba ampliando el rango de fechas o limpiando los filtros activos.",
        cta: "Limpiar filtros",
      },
    },
    error: {
      title: "No pudimos cargar el feed",
      description: "Revisa tu conexión e inténtalo de nuevo.",
      cta: "Reintentar",
    },
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
      pageOf: "Página {current} de {total}",
    },
  },
  postCard: {
    matchStatus: {
      "matched-auto": "Auto-match",
      "matched-manual": "Match manual",
      "pending-match": "Procesando",
      "no-match-found": "Sin match",
      unlinked: "Desvinculado",
      "expired-before-publish": "Licencia expiró",
    },
    matchStatusAria: "Estado de match: {status}",
    evidenceStatus: {
      live: "En vivo",
      ephemeralLive: "Evidencia temporal",
      ephemeralPreserved: "Evidencia preservada",
      removedByPlatform: "Removido por la red",
      unavailable: "No disponible",
    },
    postType: {
      reel: "Reel",
      "feed-post": "Post",
      story: "Story",
      "tiktok-video": "Video",
      "facebook-post": "Post",
    },
    publishedTime: "Publicado hace {relativeTime}",
    associatedTo: "Asociada a {licenseId} ({usageType})",
    storyExpiresIn: "Story expira en {duration} — snapshot preservado",
    storyExpired:
      "Publicación expirada en {platform}. Evidencia disponible en Licénciame.",
    pendingTitle: "Buscando licencia…",
    pendingMessage: "El sistema está validando esta publicación.",
    noMatchTitle: "Música no identificada",
    noMatchDescription:
      "El sistema detectó uso de música pero no encontró ninguna licencia vigente de tu empresa.",
    expiredBeforePublishTitle: "La licencia expiró antes de publicar",
    expiredBeforePublishDescription:
      "Esta publicación detectada ya no tiene licencia vigente que la respalde.",
    unlinkedBy: "Desvinculado por: {user}",
    unlinkedReason: "Razón: {reason}",
    metricsLabels: {
      reproductions: "reproducciones",
      impressions: "impresiones",
      likes: "likes",
      comments: "comentarios",
      shares: "shares",
      saves: "saves",
    },
    metricsUpdated: "Métricas actualizadas hace {duration}",
    metricsPending: "Métricas se sincronizarán en minutos",
    actions: {
      viewPost: "Ver publicación",
      viewPostDead: "Ver publicación (no disponible)",
      viewSnapshot: "Ver snapshot",
      viewLicense: "Detalle licencia",
      unlink: "Desvincular",
      linkManually: "Asociar a licencia manualmente",
      relink: "Re-asociar a otra licencia",
      ignore: "Ignorar",
      hide: "Ocultar",
    },
    unlinkDialog: {
      title: "¿Desvincular publicación?",
      message:
        "La licencia {licenseId} volverá a estado VIGENTE. Podrás asociarla a otra publicación después.",
      reasonLabel: "¿Por qué estás desvinculando?",
      reasonPlaceholder: "Ej: licencia equivocada, publicación eliminada, etc.",
      cancel: "Cancelar",
      confirm: "Sí, desvincular",
      pending: "Desvinculando…",
      successToast: "Publicación desvinculada.",
      errorToast: "No pudimos desvincular. Intenta de nuevo.",
    },
    snapshotDialog: {
      title: "Snapshot preservado",
      description:
        "Evidencia guardada al momento de detección. La publicación original ya no está disponible en {platform}.",
      capturedAt: "Capturado el {date}",
      caption: "Caption",
      noCaption: "Sin caption registrado.",
      hashtags: "Hashtags",
      noHashtags: "Sin hashtags.",
      close: "Cerrar",
    },
  },
  manualLink: {
    title: "Asociar publicación manualmente",
    subtitle:
      "Si tu publicación no fue detectada automáticamente, pégala aquí para asociarla a una licencia vigente.",
    fields: {
      url: {
        label: "URL de la publicación",
        placeholder: "https://instagram.com/p/…",
        help: "Soportamos URLs de Instagram, TikTok y Facebook.",
        invalidUrl: "Ingresa una URL válida.",
        invalidDomain: "La URL debe ser de Instagram, TikTok o Facebook.",
      },
      platform: { label: "Plataforma" },
      postType: { label: "Tipo de publicación" },
      publishedAt: { label: "Fecha de publicación" },
    },
    platformLabels: {
      instagram: "Instagram",
      tiktok: "TikTok",
      facebook: "Facebook",
    },
    postTypeLabels: {
      reel: "Reel",
      "feed-post": "Post de feed",
      story: "Story",
      "tiktok-video": "Video TikTok",
      "facebook-post": "Post Facebook",
    },
    validateBtn: "Validar URL",
    cancelBtn: "Cancelar",
    preview: {
      title: "Publicación detectada",
      changeBtn: "Cambiar URL",
    },
    selectLicense: {
      title: "Selecciona una licencia vigente",
      searchPlaceholder: "Buscar por track o ID de licencia…",
      issuedAgo: "emitida hace {duration}",
      noLicenses: {
        title: "No tienes licencias vigentes",
        description: "Licencia un track para poder asociar publicaciones.",
        cta: "Licenciar un track",
      },
      noResults: "Ninguna licencia coincide con tu búsqueda.",
    },
    warnings: {
      alreadyLinked:
        "Esta licencia ya está asociada a otra publicación. ¿Seguro que quieres continuar?",
      notFromConnected:
        "Esta URL no pertenece a una cuenta conectada — las métricas no se sincronizarán automáticamente.",
      incompatibleUsageType:
        "El tipo de uso de esta licencia ({usageType}) podría no ser compatible con {postType}. ¿Seguro?",
    },
    impactNotice: "Al asociar, la licencia pasará a estado CONSUMIDA.",
    backBtn: "Atrás",
    submitBtn: "Confirmar asociación",
    submitPending: "Asociando…",
    success: {
      title: "Publicación asociada correctamente",
      message:
        "{licenseId} ahora está asociada a tu publicación. Las métricas comenzarán a sincronizarse en minutos.",
      viewLicenseCta: "Ver licencia",
      linkAnotherCta: "Asociar otra publicación",
      closeCta: "Cerrar",
    },
    errors: {
      URL_INVALID: "URL inválida, verifica que sea de una plataforma soportada.",
      POST_ALREADY_LINKED: "Esta publicación ya está asociada a otra licencia.",
      LICENSE_NOT_ELIGIBLE: "La licencia seleccionada ya no es válida.",
      URL_NOT_FROM_CONNECTED_ACCOUNT:
        "La URL no pertenece a una cuenta conectada.",
      PLATFORM_SYNC_UNAVAILABLE:
        "La plataforma no está disponible ahora. Intenta más tarde.",
      POST_NOT_FOUND: "No encontramos la publicación.",
      NETWORK_ERROR: "No pudimos procesar la solicitud. Intenta de nuevo.",
    },
  },
  devPanel: {
    triggerLabel: "Panel de tracking (dev)",
    title: "Panel de Tracking",
    subtitle: "Herramientas de simulación · solo en desarrollo",
    sections: {
      controls: "Control del simulador",
      forceDetection: "Forzar detección",
      forceErrors: "Forzar errores de plataforma",
      eventLog: "Log de eventos",
    },
    controls: {
      simulatorActive: "Simulador activo",
      intervalLabel: "Intervalo de detección",
      intervalUnit: "{seconds}s",
      noMatchRateLabel: "Tasa de no-match",
      errorRateLabel: "Tasa de error",
      percent: "{value}%",
    },
    forceActions: {
      detectRandom: "Detectar post aleatorio",
      detectStory: "Detectar story (efímera)",
      detectNoMatch: "Detectar sin match",
      detectUnconnected: "Detectar en red no conectada",
      expireSoon: "Expirar próxima story en 10s",
    },
    forceErrors: {
      instagramRateLimit: "Rate limit Instagram",
      tiktokTokenExpired: "Token expirado TikTok",
      facebookDown: "API caída Facebook",
    },
    eventLog: {
      empty: "Sin eventos aún. Forza una detección para empezar.",
      clear: "Limpiar log",
      copy: "Copiar log",
      copied: "Log copiado al portapapeles",
    },
  },
  associatedContent: {
    sectionTitle: "Publicaciones asociadas",
    noPosts: {
      title: "Aún no hemos detectado publicaciones con este track",
      description:
        "Las publicaciones aparecerán aquí automáticamente dentro de unos minutos después de publicar, si tus redes están conectadas.",
      manualLinkCta: "Cargar publicación manualmente",
      connectSocialCta: "Conectar redes sociales",
      viewMonitoringCta: "Ver monitoreo general",
      stillNotPublished: "¿Aún no has publicado?",
    },
    singlePostConsumed: {
      title: "Esta licencia fue consumida por 1 publicación:",
      needToRelinkQuestion: "¿Necesitas asociarla a otra publicación?",
      unlinkCta: "Desvincular esta publicación",
    },
    monthlyExtended: {
      title: "Uso extendido mensual",
      postsCountSingular: "{count} publicación en {days} días",
      postsCountPlural: "{count} publicaciones en {days} días",
      expiresIn: "Vence en {days} días",
      expiresToday: "Vence hoy",
      totalImpressions: "Total impresiones: {count}",
      totalLikes: "Total likes: {count}",
      platformBreakdown: "{count} en {platform}",
      viewMetricsCta: "Ver métricas detalladas",
      addManualCta: "Cargar publicación manual",
    },
    expiredBeforePublish: {
      title: "Esta licencia expiró sin publicación detectada",
      description:
        "La ventana de licenciamiento venció sin que se detectara una publicación asociada. Los créditos consumidos ({credits}) no son reembolsables por vencimiento.",
      lateReportHint:
        "Si publicaste esta pieza en una red no conectada o en el momento en que el sistema no detectó, puedes reportarla:",
      reportLateCta: "Reportar publicación tardía",
      newLicenseCta: "Licenciar nuevamente",
      lateReportWarning:
        "Estás reportando una publicación con licencia ya expirada. Esto quedará registrado como evidencia histórica pero no revertirá el estado de la licencia.",
    },
    cancelled: {
      description:
        "Esta licencia fue anulada. No hay publicaciones asociadas activas.",
      reason: "Razón de anulación: {reason}",
      cancelledAt: "Anulada el: {date}",
      refundNote: "Los créditos fueron devueltos a tu bolsa.",
    },
  },
  associatedPostRow: {
    detectedTitle: "Publicación detectada",
    actions: {
      viewPost: "Ver publicación",
      viewPostDead: "Ver publicación (no disponible)",
      viewMetrics: "Ver métricas",
      viewSnapshot: "Ver snapshot",
      unlink: "Desvincular",
    },
  },
  snapshotViewer: {
    title: "Snapshot preservado",
    description:
      "Este contenido expiró en {platform} el {date}. Licénciame preservó la evidencia al momento de detección.",
    sections: {
      metadata: "Metadata al momento de detección",
      metrics: "Métricas finales capturadas",
      track: "Track detectado",
      license: "Licencia asociada",
    },
    fields: {
      platform: "Plataforma",
      postType: "Tipo",
      originalUrl: "URL original",
      originalUrlUnavailable: "{url} (no disponible)",
      publishedAt: "Publicado",
      detectedAt: "Detectado",
      lifetime: "Vida en plataforma",
      reproductions: "Reproducciones",
      interactions: "Interacciones",
      noMetrics: "Métricas no disponibles.",
      noLicense: "Sin licencia asociada.",
    },
    downloadEvidence: "Descargar como evidencia",
    close: "Cerrar",
    evidencePdf: {
      title: "EVIDENCIA DE PUBLICACIÓN PRESERVADA",
      subtitle: "Registro legal de publicación efímera",
      footer: "Documento generado por Licénciame · Auditable",
      filenamePrefix: "evidencia",
    },
  },
  unlinkDialog: {
    title: "¿Desvincular publicación?",
    subtitle: "Estás a punto de desvincular:",
    impactTitle: "Al confirmar:",
    impacts: {
      backToActive: "La licencia {licenseId} volverá a estado VIGENTE.",
      canRelink: "Podrás asociarla a otra publicación.",
      auditTrail: "Esta acción queda registrada para auditoría.",
    },
    reasonLabel: "¿Por qué estás desvinculando? *",
    reasons: {
      "wrong-license": "Licencia equivocada",
      "post-deleted": "Publicación eliminada de la red",
      "wrong-match": "Match incorrecto del sistema",
      other: "Otra razón",
    },
    commentsLabel: "Comentarios adicionales (opcional)",
    commentsPlaceholder: "Cuéntanos más sobre el motivo…",
    cancel: "Cancelar",
    confirm: "Confirmar desvincular",
    submitting: "Desvinculando…",
    success: "Publicación desvinculada. {licenseId} volvió a VIGENTE.",
    error: {
      title: "No pudimos desvincular",
      ephemeralPreserved:
        "No puedes desvincular publicaciones con evidencia preservada — es evidencia histórica.",
      generic: "Intenta de nuevo en unos segundos.",
    },
  },
  relinkDialog: {
    title: "Re-asociar publicación",
    subtitle:
      "Esta publicación fue desvinculada previamente. Puedes asociarla a otra licencia vigente.",
    postLabel: "Publicación:",
    cancel: "Cancelar",
    confirm: "Confirmar asociación",
    submitting: "Asociando…",
    success: "Publicación asociada a {licenseId}.",
  },
  syncCascadeError: {
    bannerTitle: "Sincronización con {platform} no disponible",
    bannerMessage: "Verifica tu conexión OAuth o reintenta más tarde.",
    reconnectCta: "Reconectar {platform}",
    dismissCta: "Entendido",
  },
} as const;
