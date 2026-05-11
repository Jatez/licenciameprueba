/** All UI strings for F-05 — Spanish only. Code stays English. */
export const licensingStrings = {
  wizard: {
    title: "Licenciar canción",
    cancel: "Cancelar",
    backToTrack: "Volver al track",
    help: "Ayuda",
    next: "Siguiente",
    previous: "Anterior",
    stepIndicator: "Paso {current} de {total}",
    aria: "Licenciamiento paso {current} de {total}",
    steps: {
      1: "Track",
      2: "Tipo de uso",
      3: "Resumen",
      4: "Confirmación",
    },
    cancelDialog: {
      title: "¿Cancelar licenciamiento?",
      description: "Perderás tu selección y no se consumirán créditos.",
      cancel: "Seguir licenciando",
      confirm: "Sí, cancelar",
    },
    leaveWarning:
      "Tienes un licenciamiento en curso. Si sales, perderás tu selección.",
    nextDisabledReasons: {
      noUsageType: "Selecciona un tipo de uso para continuar.",
      validating: "Validando disponibilidad...",
      notAllowed: "Este tipo de uso no está disponible para este track.",
      insufficient: "Saldo insuficiente para este tipo de uso.",
    },
  },
  step1: {
    intro: "Estás a punto de licenciar:",
    continueQuestion: "¿Es este el track correcto?",
    continueYes: "Sí, continuar",
    continueNo: "No, volver al catálogo",
    licensableOn: "Licenciable en:",
    preview: "Reproducir preview (30s)",
    pause: "Pausar preview",
    trackNotFound: {
      title: "No encontramos este track",
      description:
        "El enlace que seguiste no corresponde a ninguna canción del catálogo.",
      cta: "Volver al catálogo",
    },
    trackRemoved: {
      title: "Este track ya no está disponible",
      description:
        "Fue removido del catálogo y no puede ser licenciado. Explora alternativas similares.",
      cta: "Volver al catálogo",
    },
    loadError: {
      title: "No pudimos cargar el track",
      description: "Revisa tu conexión e inténtalo nuevamente.",
      cta: "Volver al catálogo",
    },
  },
  step2: {
    title: '¿Cómo vas a usar "{trackTitle}"?',
    subtitle:
      "Elige el tipo de uso que mejor describe tu publicación. El costo en créditos varía según el alcance del uso.",
    resultingBalance: "Saldo tras licenciar: {current} → {resulting} créditos",
    resultingBalanceZero: "Tu saldo quedará en 0 créditos después de esta licencia",
    notAvailableForTrack: "No disponible para este track",
    notAvailableTooltip:
      "Esta canción no permite este tipo de uso por restricciones del titular.",
    insufficientForType: "Saldo insuficiente para este tipo",
    validatingLabel: "Validando...",
  },
  wallet: {
    currentBalance: "Tu saldo: {balance} créditos",
    expiresIn: "Vence en {duration}",
    insufficient: "Saldo insuficiente",
    buyCredits: "Comprar créditos",
    aria: "Saldo actual de la bolsa de créditos",
  },
  insufficientBanner: {
    title: "Saldo insuficiente",
    message:
      "Necesitas {needed} créditos, pero solo tienes {available}. Te faltan {missing} para licenciar este tipo de uso.",
    buyCta: "Comprar créditos",
    chooseOtherCta: "Elegir otro tipo de uso",
  },
  usageTypes: {
    "single-use": {
      title: "Uso único",
      description: "1 post, Reel, TikTok o video corto",
      example: "Ej: Un único Reel de Instagram",
    },
    "stories-pack": {
      title: "Paquete de stories (hasta 5)",
      description: "Stories del mismo concepto, misma canción",
      example: "Ej: 5 stories secuenciales de lanzamiento",
    },
    "monthly-extended": {
      title: "Uso extendido mensual",
      description: "Uso ilimitado por 1 mes en todas las redes",
      example: "Ej: Campaña mensual completa",
    },
    "long-video": {
      title: "Video largo (1-3 min)",
      description: "Recaps, aftermovies, behind the scenes",
      example: "Ej: Aftermovie de un evento",
    },
    "paid-post": {
      title: "Post con pauta paga",
      description: "Publicación con inversión publicitaria (ads/boosting)",
      example: "Ej: Reel con pauta en Meta Ads",
    },
    "collaborative-post": {
      title: "Post colaborativo",
      description: "Cocreación de contenido con aliado externo",
      example: "Ej: Collab con otra marca o influencer",
    },
  },
  step3: {
    title: "Revisa tu licenciamiento",
    subtitle: "Antes de confirmar, revisa cuidadosamente los detalles.",
    sections: {
      track: "Track",
      usage: "Tipo de uso",
      balance: "Consumo de créditos",
      terms: "Condiciones de la licencia",
      cancellation: "Política de anulación",
      platforms: "Licenciable en:",
    },
    balance: {
      current: "Saldo actual",
      consumed: "Créditos a consumir",
      resulting: "Saldo resultante",
      zeroWarning:
        "Tu saldo quedará en 0. Considera comprar más créditos después.",
    },
    terms: {
      intro:
        "Al confirmar, recibirás una licencia con las siguientes condiciones:",
      viewFull: "Ver términos completos",
      hideFull: "Ocultar términos",
    },
    cancellation: {
      viewFull: "Ver política completa",
      dialogTitle: "Política de anulación",
      version: "Versión {version}",
    },
    consent: {
      label:
        "He leído y acepto las condiciones de la licencia y la política de anulación. Entiendo que esta licencia es irreversible excepto durante el plazo de anulación aplicable.",
      required: "Acepta las condiciones para continuar",
    },
    submit: {
      idle: "Confirmar licenciamiento",
      pending: "Emitiendo licencia...",
      disabledTooltip: "Acepta las condiciones para continuar",
    },
    revalidating: "Revisando disponibilidad...",
    errors: {
      INSUFFICIENT_CREDITS: {
        title: "Saldo insuficiente",
        message:
          "Otro usuario de tu empresa puede haber licenciado al mismo tiempo. Tu saldo actual es {balance} créditos, pero necesitas {required}.",
        primaryCta: "Comprar créditos",
        secondaryCta: "Volver al paso anterior",
      },
      WALLET_EXPIRED_DURING_TRANSACTION: {
        title: "Tu bolsa expiró durante el proceso",
        message:
          "La bolsa de créditos venció mientras confirmabas. No se consumieron créditos.",
        primaryCta: "Comprar nueva bolsa",
        secondaryCta: "Cancelar",
      },
      TERMS_VERSION_OUTDATED: {
        title: "Los términos fueron actualizados",
        message:
          "Los términos y condiciones cambiaron mientras revisabas. Por seguridad, debes aceptar los nuevos términos.",
        primaryCta: "Revisar nuevos términos",
        secondaryCta: "Cancelar",
      },
      CONCURRENT_LICENSING_DETECTED: {
        title: "Detectamos actividad simultánea",
        message:
          "Se está emitiendo otra licencia al mismo tiempo desde tu cuenta. Espera unos segundos e intenta de nuevo.",
        primaryCta: "Reintentar",
        secondaryCta: "Cancelar",
      },
      NETWORK_ERROR: {
        title: "No pudimos emitir la licencia",
        message:
          "Intenta de nuevo en unos segundos. Si el problema persiste, contacta a soporte. Tu saldo de créditos no fue afectado.",
        primaryCta: "Reintentar",
        secondaryCta: "Cancelar",
      },
      UNEXPECTED_ERROR: {
        title: "Ocurrió un error inesperado",
        message:
          "Contacta a soporte con la referencia: {reference}. Tus créditos no fueron descontados.",
        primaryCta: "Contactar soporte",
        secondaryCta: "Cancelar",
      },
    },
  },
  step4: {
    successTitle: "Licencia emitida correctamente",
    licenseIdLabel: "ID de licencia",
    detailsTitle: "Detalles de tu licencia",
    fields: {
      track: "Track",
      usageType: "Tipo de uso",
      creditsUsed: "Créditos usados",
      issuedAt: "Fecha de emisión",
      status: "Estado",
      issuedBy: "Emitida por",
      cancellableUntil: "Anulable hasta",
      currentBalance: "Saldo actual",
    },
    statusLabels: {
      active: "VIGENTE",
      consumed: "CONSUMIDA",
      expired: "EXPIRADA",
      cancelled: "ANULADA",
    },
    certificate: {
      title: "Certificado de licencia",
      subtitle: "Tu evidencia legal de esta licencia está lista.",
      downloadCta: "Descargar certificado PDF",
      downloadAria: "Descargar certificado en formato PDF",
      viewCta: "Ver certificado",
      viewDialogTitle: "Vista previa del certificado",
      emailNote: "También enviamos una copia a tu email corporativo.",
      generating: "Generando PDF...",
    },
    nextSteps: {
      title: "¿Qué sigue?",
      step1: "Publica tu contenido con este track en redes sociales.",
      step2: "Conecta tus redes para trackeo automático de la publicación.",
      step3:
        "Ve tus métricas en el dashboard cuando se detecten las publicaciones.",
      connectSocialCta: "Conectar redes",
      dashboardCta: "Ir al dashboard",
    },
    actions: {
      viewLicenses: "Ver mis licencias",
      licenseAnother: "Licenciar otro track",
      goToDashboard: "Ir al dashboard",
    },
    refreshFallback: "Tu licencia fue emitida correctamente.",
  },
  certificate: {
    pdfTitle: "CERTIFICADO DE LICENCIA MUSICAL",
    sections: {
      company: "EMPRESA LICENCIATARIA",
      track: "TRACK LICENCIADO",
      license: "LICENCIA OTORGADA",
      conditions: "CONDICIONES DE USO",
    },
    fields: {
      companyName: "Nombre",
      companyId: "ID",
      trackTitle: "Título",
      trackArtist: "Artista",
      trackAlbum: "Álbum",
      trackDuration: "Duración",
      trackIsrc: "ISRC",
      usageType: "Tipo de uso",
      credits: "Créditos consumidos",
      issuedAt: "Fecha de emisión",
      issuedBy: "Emitida por",
      status: "Estado actual",
      cancellableUntil: "Ventana de anulación",
    },
    notAvailable: "N/D",
    footer: "Emitido por Licénciame",
    website: "www.licenciame.co",
    legalNotice:
      "Este documento certifica que {company} adquirió una licencia musical para el uso del track arriba especificado, bajo los términos aceptados en la fecha y hora de emisión.",
    termsVersionLabel: "Términos aceptados versión",
    hashLabel: "Hash único",
    statusActive: "VIGENTE",
  },
  errors: {
    missingTrackId: "Selecciona una canción para licenciar.",
  },
  list: {
    title: "Mis licencias",
    subtitle: "Todas las licencias que has emitido desde tu cuenta.",
    newLicenseCta: "Licenciar track",
    aggregates: {
      active: "Vigentes",
      consumed: "Consumidas",
      expired: "Expiradas",
      cancelled: "Anuladas",
      creditsConsumed: "Créditos usados",
    },
    filters: {
      search: "Buscar por track o ID de licencia…",
      searchAria: "Buscar licencias",
      status: {
        label: "Estado",
        all: "Todos los estados",
        active: "Vigente",
        consumed: "Consumida",
        expired: "Expirada",
        cancelled: "Anulada",
      },
      dateRange: {
        label: "Fecha",
        any: "Cualquier fecha",
        today: "Hoy",
        last7: "Últimos 7 días",
        last30: "Últimos 30 días",
        last90: "Últimos 90 días",
      },
      sort: {
        label: "Ordenar",
        "issuedAt-desc": "Más recientes",
        "issuedAt-asc": "Más antiguas",
        "track-asc": "Track (A-Z)",
        "creditsConsumed-desc": "Más créditos",
        "creditsConsumed-asc": "Menos créditos",
      },
      clear: "Limpiar filtros",
    },
    pagination: {
      page: "Página {current} de {total}",
      perPage: "{size} por página",
      previous: "Anterior",
      next: "Siguiente",
    },
    columns: {
      id: "ID",
      track: "Track",
      usageType: "Tipo de uso",
      credits: "Créditos",
      issuedAt: "Fecha",
      status: "Estado",
      actions: "Acciones",
    },
    rowActions: {
      menuLabel: "Acciones de la licencia",
      viewDetail: "Ver detalle",
      downloadCertificate: "Descargar certificado",
      cancel: "Anular licencia",
    },
    statusBadge: {
      active: "VIGENTE",
      consumed: "CONSUMIDA",
      expired: "EXPIRADA",
      cancelled: "ANULADA",
      tooltip: {
        active: "Licencia vigente. Puede consumirse o anularse dentro de la ventana.",
        consumed: "Licencia ya asociada a una publicación.",
        expired: "Licencia expirada sin uso.",
        cancelled: "Licencia anulada. Los créditos fueron devueltos.",
      },
    },
    empty: {
      noLicenses: {
        title: "Aún no has licenciado ninguna canción",
        description:
          "Explora el catálogo y licencia tu primera canción para trackear su uso legal.",
        cta: "Explorar catálogo",
      },
      noResults: {
        title: "Ninguna licencia coincide con tus filtros",
        description: "Prueba ajustando o limpiando los filtros aplicados.",
        cta: "Limpiar filtros",
      },
    },
    error: {
      title: "No pudimos cargar tus licencias",
      description: "Inténtalo nuevamente en unos segundos.",
      cta: "Reintentar",
    },
  },
  detail: {
    backToList: "Volver a mis licencias",
    sections: {
      info: "Información de la licencia",
      timeline: "Línea de tiempo",
      associatedContent: "Publicaciones asociadas",
      cancellation: "Anulación",
    },
    actions: {
      downloadCertificate: "Descargar certificado",
      cancel: "Anular licencia",
      contactSupport: "Contactar soporte",
    },
    fields: {
      track: "Track",
      artist: "Artista",
      album: "Álbum",
      duration: "Duración",
      isrc: "ISRC",
      usageType: "Tipo de uso",
      credits: "Créditos",
      issuedAt: "Emitida",
      issuedBy: "Emisor",
      termsVersion: "T&C",
      hash: "Hash",
      cancellableUntil: "Anulable hasta",
      cancelledAt: "Anulada el",
      cancellationReason: "Motivo de anulación",
    },
    timeline: {
      issued: "Emitida",
      consumed: "Consumida",
      consumedPending: "Pendiente publicación",
      cancelled: "Anulada",
      expired: "Expirada",
      expiredWithoutPublish: "Expiró sin publicación detectada",
      cancellationWindow: "Ventana de anulación",
      cancellationWindowUntil: "Hasta {date}",
      cancellationWindowClosed: "Cerrada",
    },
    associatedContent: {
      noneTitle: "Aún no hemos detectado publicaciones con este track",
      noneDescription:
        "Conecta tus redes para trackeo automático de las publicaciones.",
      connectSocialCta: "Conectar redes",
      viewMetricsCta: "Ver métricas en el dashboard",
    },
    cancellation: {
      withinWindow: {
        title:
          "Puedes anular esta licencia durante las próximas {hours} horas",
        description:
          "Si aún no has publicado y necesitas anular, hazlo ahora para recuperar tus créditos sin penalización.",
        cta: "Solicitar anulación",
      },
      windowExpired: {
        title: "La ventana de anulación de 48 horas expiró",
        description:
          "Si necesitas anular esta licencia, contacta a soporte con el ID de licencia y el motivo.",
        cta: "Contactar soporte",
      },
      alreadyConsumed:
        "Esta licencia fue consumida el {date}. Las licencias consumidas no pueden anularse.",
      alreadyCancelled:
        "Esta licencia fue anulada el {date}. Razón: {reason}.",
      alreadyExpired:
        "Esta licencia expiró el {date} sin haber sido asociada a publicaciones.",
    },
    notFound: {
      title: "No encontramos esta licencia",
      description: "El ID que seguiste no corresponde a ninguna licencia.",
      cta: "Volver a mis licencias",
    },
    error: {
      title: "No pudimos cargar la licencia",
      cta: "Reintentar",
    },
  },
  cancellationDialog: {
    title: "Anular licencia",
    subtitle: "Estás a punto de anular:",
    refundOne: "Se te devolverá 1 crédito a tu bolsa actual.",
    refundMany: "Se te devolverán {credits} créditos a tu bolsa actual.",
    reasonLabel: "¿Por qué quieres anular esta licencia?",
    reasons: {
      "wrong-usage-type": "Elegí el tipo de uso equivocado",
      "wrong-track": "Elegí el track equivocado",
      "decided-not-to-publish": "Decidí no publicar este contenido",
      "duplicate-license": "Licencia duplicada",
      other: "Otra razón",
    },
    commentsLabel: "Comentarios adicionales (opcional)",
    commentsPlaceholder: "Cuéntanos más sobre el motivo…",
    cancel: "Cancelar",
    confirm: "Confirmar anulación",
    submitting: "Anulando…",
    successOne: "Licencia anulada. 1 crédito devuelto a tu bolsa.",
    successMany: "Licencia anulada. {credits} créditos devueltos a tu bolsa.",
    errors: {
      CANCELLATION_WINDOW_EXPIRED: "La ventana de anulación ya expiró.",
      LICENSE_ALREADY_CONSUMED:
        "Esta licencia ya fue consumida y no puede anularse.",
      LICENSE_ALREADY_CANCELLED: "Esta licencia ya estaba anulada.",
      LICENSE_NOT_FOUND: "No encontramos esta licencia.",
      NETWORK_ERROR: "No pudimos procesar la anulación. Intenta de nuevo.",
    },
  },
} as const;

/** Tiny template helper — `format("Hi {name}", { name: "Ana" })`. */
export function formatString(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
