export const matchTracksStrings = {
  nav: {
    label: "Match de tracks",
    tooltip: "Cruza canciones de Spotify, TikTok o Meta contra el catálogo licenciable de Licénciame.",
  },
  hub: {
    title: "Match de tracks",
    subtitle:
      "Encuentra qué canciones de tus playlists o publicaciones ya están disponibles para licenciar en Licénciame.",
    demoNote: "En esta demo, los resultados son simulados. No se conectan APIs reales.",
    sources: {
      spotify: {
        title: "Importar playlist de Spotify",
        description: "Pega una URL o ID de playlist para cruzar sus tracks contra nuestro catálogo.",
        cta: "Importar playlist",
      },
      social: {
        title: "Revisar música detectada en TikTok / Meta",
        description: "Simula la detección de canciones usadas en publicaciones y revisa si están licenciables.",
        cta: "Ver detecciones",
      },
      history: {
        title: "Historial de análisis",
        description: "Consulta análisis recientes de playlists, publicaciones y campañas.",
        cta: "Ver historial",
      },
    },
    metrics: {
      analyses: { label: "Análisis realizados" },
      tracksAnalyzed: { label: "Tracks analizados" },
      matchesFound: { label: "Matches encontrados" },
      matchRate: {
        label: "Match rate promedio",
        helper: "Porcentaje de canciones externas encontradas en el catálogo Licénciame.",
      },
      notAvailable: { label: "Tracks no disponibles" },
    },
    explanation: {
      title: "¿Cómo funciona el match?",
      steps: [
        "Importas una playlist o sincronizas publicaciones.",
        "Licénciame compara metadata contra su catálogo.",
        "Ves qué canciones puedes licenciar y cuáles no están disponibles.",
      ],
    },
    integrations: {
      title: "Estado de plataformas",
      subtitle: "Conexiones simuladas para esta demo.",
    },
    recent: {
      title: "Análisis recientes",
      empty: "Aún no has corrido ningún análisis.",
      emptyCta: "Importar playlist",
    },
  },
  spotify: {
    title: "Importar playlist de Spotify",
    subtitle:
      "Pega una URL o ID de playlist para identificar qué canciones están disponibles en el catálogo de Licénciame.",
    inputLabel: "URL o ID de playlist",
    inputPlaceholder: "https://open.spotify.com/playlist/…",
    submit: "Analizar playlist",
    demo: "Usar playlist demo",
    analyzing: "Analizando…",
    helper: "Esta demo no conecta con Spotify. Los resultados son simulados para validar la experiencia.",
    stepperTitle: "Analizando playlist",
    metaLabels: {
      owner: "Propietario",
      totalTracks: "Tracks",
      duration: "Duración",
      source: "Origen",
      analyzedAt: "Fecha de análisis",
    },
    summary: {
      title: "Resumen del análisis",
      analyzed: "Tracks analizados",
      matched: "Encontrados en Licénciame",
      partial: "Parcialmente matcheados",
      notAvailable: "No disponibles",
      matchRate: "Match rate",
      lowMessage:
        "Encontramos algunos tracks licenciables, pero gran parte de la playlist no está disponible aún en el catálogo.",
      lowCta: "Explorar catálogo recomendado",
      highMessage: "Varios tracks de esta playlist están disponibles para licenciar directamente.",
      highCta: "Ver tracks licenciables",
    },
    statusLabel: {
      matched: "Licenciable",
      partial: "Revisar versión",
      not_available: "No disponible",
      removed: "Removido",
    },
    table: {
      track: "Track en Spotify",
      artist: "Artista",
      album: "Álbum / versión",
      status: "Estado de match",
      confidence: "Confianza",
      catalog: "Match en Licénciame",
      credits: "Créditos",
      actions: "Acción",
      empty: "—",
    },
    actions: {
      license: "Licenciar",
      review: "Revisar match",
      findAlternative: "Buscar alternativa",
      viewDetail: "Ver detalle",
    },
    largePlaylist: {
      title: "Playlist grande detectada",
      body:
        "Esta playlist tiene más de 100 canciones. Los resultados se muestran paginados para facilitar revisión.",
      pageOf: (page: number, total: number) => `Página ${page} de ${total}`,
      prev: "Anterior",
      next: "Siguiente",
    },
    apiError: {
      title: "No pudimos conectar con Spotify",
      body:
        "Spotify no está disponible en este momento. Intenta de nuevo más tarde o usa una playlist demo.",
      retry: "Reintentar",
      demo: "Usar playlist demo",
    },
    zeroMatches: {
      title: "No encontramos canciones licenciables en esta playlist",
      body:
        "Puedes explorar el catálogo de Licénciame para encontrar canciones similares disponibles para licenciar.",
      cta: "Explorar catálogo",
    },
    triggerError: "Simular error de Spotify",
    triggerZero: "Simular 0 matches",
  },
  social: {
    title: "Match desde TikTok y Meta",
    subtitle:
      "Revisa música detectada en publicaciones, campañas o Reels y valida si está disponible para licenciar en Licénciame.",
    integrationsTitle: "Estado de integraciones",
    platforms: {
      tiktok: {
        statusConnected: "Conectado",
        statusDemo: "Demo conectado",
        microcopy: "Detección simulada de música en videos publicados.",
        cta: "Sincronizar TikTok",
      },
      meta: {
        statusConnected: "Conectado",
        statusDemo: "Demo conectado",
        microcopy: "Detección simulada de música en Reels, posts y campañas.",
        cta: "Sincronizar Meta",
      },
      spotify: {
        statusManual: "Disponible por playlist",
        microcopy: "Importación manual por URL o ID de playlist.",
        cta: "Ir a Spotify Match",
      },
      error: "No conectado",
    },
    syncStepperTitle: "Sincronizando plataforma",
    metricsTitle: "Resultado de la detección",
    metrics: {
      postsAnalyzed: "Publicaciones analizadas",
      tracksDetected: "Canciones detectadas",
      matchedLicensable: "Matches licenciables",
      partial: "Matches parciales",
      notAvailable: "No disponibles",
      potentialRisks: "Posibles riesgos de uso",
    },
    risksHelper:
      "Posibles riesgos de uso son canciones detectadas en publicaciones que no aparecen como licenciadas en el catálogo.",
    detectionsTitle: "Detecciones recientes",
    detectionsTable: {
      post: "Publicación / campaña",
      platform: "Plataforma",
      track: "Track detectado",
      artist: "Artista",
      matchStatus: "Estado de match",
      confidence: "Confianza",
      licenseStatus: "Estado de licencia",
      actions: "Acción",
    },
    matchStatus: {
      matched: "Match exacto",
      partial: "Match parcial",
      not_available: "No disponible",
      legal_review: "En revisión legal",
    },
    licenseStatus: {
      licensed: "Licenciada",
      not_licensed: "No licenciada",
      pending_review: "Pendiente revisión",
      potential_risk: "Riesgo potencial",
    },
    actions: {
      license: "Licenciar",
      review: "Revisar",
      viewLicense: "Ver licencia",
      findAlternative: "Buscar alternativa",
    },
    explanation: {
      title: "Diferencia entre fuentes",
      spotifyTitle: "Spotify",
      spotifyBody: "Analiza playlists importadas manualmente por URL o ID.",
      socialTitle: "TikTok / Meta",
      socialBody: "Analiza música detectada en publicaciones o campañas conectadas.",
      catalogTitle: "Licénciame",
      catalogBody: "Cruza esos tracks contra el catálogo disponible para licenciamiento.",
    },
    errors: {
      platform: {
        title: "No pudimos sincronizar esta plataforma",
        body: "La plataforma no está disponible en este momento. Intenta nuevamente más tarde.",
        retry: "Reintentar",
      },
      noPosts: {
        title: "No encontramos publicaciones recientes",
        body:
          "Cuando existan publicaciones o campañas con música detectada, aparecerán aquí.",
      },
      noMetadata: {
        title: "Música detectada sin metadata suficiente",
        body:
          "No tenemos suficiente información para cruzar esta canción contra el catálogo.",
      },
    },
    triggerSyncTikTok: "Sincronizar TikTok",
    triggerSyncMeta: "Sincronizar Meta",
    triggerError: "Simular error de plataforma",
    triggerEmpty: "Simular sin publicaciones",
  },
  results: {
    title: "Resultados del match",
    subtitle:
      "Revisa qué canciones puedes licenciar directamente y cuáles requieren validación.",
    criteria: {
      title: "Criterio de match usado en esta demo",
      note:
        "Este criterio es simulado. El algoritmo final debe definirse técnicamente.",
      items: [
        { title: "Match exacto", body: "Coincidencia por ISRC o metadata altamente confiable." },
        {
          title: "Match por título + artista",
          body: "Coincidencia fuerte entre nombre de canción y artista.",
        },
        {
          title: "Match parcial",
          body:
            "Posible coincidencia, pero puede tratarse de otra versión, remix, live session o edición distinta.",
        },
        {
          title: "No disponible",
          body: "No encontramos una coincidencia suficiente en el catálogo Licénciame.",
        },
      ],
    },
    filters: {
      all: "Todos",
      sourceLabel: "Fuente",
      matchLabel: "Estado de match",
      licenseLabel: "Estado de licencia",
      confidenceLabel: "Confianza mínima",
      creditsLabel: "Créditos máx.",
      reset: "Limpiar filtros",
      sources: { spotify: "Spotify", tiktok: "TikTok", meta: "Meta" },
      match: {
        matched: "Licenciable",
        partial: "Parcial",
        not_available: "No disponible",
        legal_review: "En revisión",
      },
      license: {
        licensed: "Licenciada",
        not_licensed: "No licenciada",
        pending: "Pendiente",
      },
    },
    columns: {
      track: "Track externo",
      artist: "Artista",
      source: "Fuente",
      catalog: "Match Licénciame",
      matchType: "Tipo de match",
      confidence: "Confianza",
      credits: "Créditos",
      status: "Estado",
      actions: "Acción",
    },
    statusCopy: {
      matched: {
        label: "Licenciable",
        body: "Esta canción está en nuestro catálogo. Puedes licenciarla.",
        cta: "Licenciar",
      },
      partial: {
        label: "Parcial",
        body: "Encontramos una posible coincidencia. Revisa si es la versión correcta.",
        cta: "Revisar match",
      },
      not_available: {
        label: "No disponible",
        body: "Esta canción no está disponible en el catálogo.",
        cta: "Buscar alternativa",
      },
      already_licensed: {
        label: "Ya licenciada",
        body: "Esta canción ya tiene una licencia asociada.",
        cta: "Ver licencia",
      },
    },
    bulk: {
      selectedCount: (n: number) => `${n} seleccionado${n === 1 ? "" : "s"}`,
      license: "Licenciar seleccionados",
      export: "Exportar resultados",
      alternatives: "Buscar alternativas",
      warningMixed:
        "Solo los tracks encontrados en el catálogo pueden licenciarse directamente.",
      exportToast: "Exportación demo generada.",
      bulkLicensedToast: (n: number) =>
        `${n} licencias creadas en modo demo.`,
    },
    lowBanner: {
      title: "Match rate bajo",
      body:
        "Encontramos pocos tracks disponibles en el catálogo para esta fuente. Puedes explorar canciones similares o solicitar revisión del catálogo.",
      explore: "Explorar catálogo",
      viewMissing: "Ver no disponibles",
    },
    partialDrawer: {
      title: "Revisar coincidencia parcial",
      detected: "Track detectado",
      catalog: "Posible match en Licénciame",
      fields: {
        name: "Nombre",
        artist: "Artista",
        album: "Álbum / versión",
        version: "Versión",
        source: "Fuente",
        duration: "Duración",
        metadata: "Metadata disponible",
        credits: "Créditos requeridos",
        legal: "Estado legal",
        confidence: "Confianza",
      },
      alert:
        "Esta coincidencia puede corresponder a otra versión. Revisa antes de licenciar.",
      confirm: "Confirmar y licenciar",
      findOther: "Buscar otro match",
      markUnavailable: "Marcar como no disponible",
    },
    licenseModal: {
      title: "Licenciar track",
      track: "Track",
      artist: "Artista",
      credits: "Créditos requeridos",
      usage: "Uso autorizado",
      company: "Empresa",
      detectedSource: "Fuente detectada",
      licenseStatus: "Estado de licencia",
      confirm: "Confirmar licencia demo",
      cancel: "Cancelar",
      toast: "Licencia creada en modo demo.",
      defaults: {
        usage: "Uso digital · Redes sociales · 12 meses",
        company: "Acme Marketing S.A.S.",
        licenseStatus: "No licenciada",
      },
    },
    alternativesDrawer: {
      title: "Alternativas recomendadas",
      subtitle:
        "Tracks del catálogo Licénciame con mood o género similar al detectado.",
      cta: "Licenciar alternativa",
      empty: "No encontramos alternativas para este track.",
    },
  },
  status: {
    matched: "Licenciable",
    partial: "Match parcial",
    not_available: "No disponible",
    connected: "Conectada",
    disconnected: "No conectada",
    error: "Error de conexión",
  },
  platforms: {
    spotify: "Spotify",
    tiktok: "TikTok",
    meta: "Meta",
    catalog: "Licénciame Catalog",
  },
} as const;
