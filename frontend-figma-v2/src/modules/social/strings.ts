/**
 * Social feature strings. UI in Spanish, code in English. Ready for i18n.
 */
export const socialStrings = {
  header: {
    title: "Redes sociales",
    subtitle:
      "Conecta tus cuentas para hacer tracking automático de publicaciones con música licenciada.",
  },
  counter: {
    label: "{connected} de {total} conectadas",
    aria: "Cuentas conectadas",
  },
  contextBanner: {
    text: "Sin redes conectadas no podemos medir el rendimiento de tus publicaciones ni validar el uso de tus licencias.",
    dismiss: "Cerrar aviso",
  },
  card: {
    statuses: {
      not_connected: "Sin conectar",
      connected: "Activa",
      token_expired: "Reconexión requerida",
      error: "Error",
      permissions_revoked: "Permisos revocados",
      duplicate_account: "Cuenta duplicada",
    },
    body: {
      not_connected: "Conecta tu cuenta para empezar a medir.",
      connectedPrimary: "{username} · Conectada hace {duration}",
      connectedSecondary: "Última sincronización: hace {duration}",
      tokenExpiredPrimary: "{username} · El token expiró el {date}",
      tokenExpiredSecondary:
        "Las métricas se detuvieron. Reconecta para continuar.",
      error: "No pudimos verificar tu cuenta.",
      permissionsRevokedPrimary:
        "{username} · Revocaste los permisos desde {platform}",
      permissionsRevokedSecondary:
        "Para reanudar el tracking, vuelve a autorizar a Licénciame.",
      duplicateAccountPrimary:
        "{username} ya está vinculada a otra empresa en Licénciame.",
      duplicateAccountSecondary:
        "Una cuenta solo puede pertenecer a una empresa a la vez. Si crees que es un error, contáctanos.",
    },
    actions: {
      connect: "Conectar",
      manage: "Gestionar",
      reconnect: "Reconectar",
      retry: "Reintentar",
      reAuthorize: "Re-autorizar",
      contactSupport: "Contactar soporte",
      moreOptions: "Más opciones",
    },
    menu: {
      viewDetails: "Ver detalles",
      syncNow: "Sincronizar ahora",
      disconnect: "Desconectar",
    },
    supportMailto:
      "mailto:soporte@licenciame.com?subject=Cuenta%20duplicada%20en%20Licénciame",
  },
  whyConnect: {
    title: "¿Por qué necesitamos conectar tus redes?",
    sections: {
      permissions: {
        title: "Qué permisos solicitamos",
        body: "Pedimos acceso de lectura a tus publicaciones públicas y a métricas básicas de rendimiento (vistas, likes, comentarios). Nada más.",
      },
      neverDo: {
        title: "Qué nunca haremos",
        body: "Nunca publicamos por ti, no leemos mensajes privados ni accedemos a contenido de cuentas privadas. Tus credenciales nunca pasan por nuestros servidores.",
      },
      disconnect: {
        title: "Cómo desconectar en cualquier momento",
        body: "Desde el menú \"Gestionar\" de cada cuenta puedes desconectar y revocar todos los permisos al instante. Los datos históricos se conservan según tu plan.",
      },
    },
  },
  loadingError: {
    title: "No pudimos cargar tus redes sociales",
    description: "Revisa tu conexión e intenta de nuevo.",
    retry: "Reintentar",
  },
  connectFlow: {
    consent: {
      title: "Conectar con {platform}",
      subtitle: "Antes de continuar, queremos que sepas qué permisos te pediremos.",
      willDoTitle: "Qué vamos a hacer",
      willDo: [
        "Leer tus publicaciones públicas para hacer match con las canciones que licencies",
        "Obtener métricas públicas (views, likes, comentarios, shares)",
        "Verificar que eres el dueño de la cuenta",
      ],
      neverDoTitle: "Qué nunca haremos",
      neverDo: [
        "Publicar en tu nombre",
        "Leer mensajes directos o contenido privado",
        "Compartir tus datos con terceros",
        "Acceder a cuentas distintas a la que autorices",
      ],
      legal:
        "Puedes revocar este acceso en cualquier momento desde esta pantalla o desde tu configuración de {platform}.",
      privacyLink: "Política de privacidad",
      cancel: "Cancelar",
      continue: "Continuar a {platform}",
    },
    oauth: {
      simulationBanner: "🔒 Simulación OAuth · Sin conexión real",
      title: "Licénciame quiere acceder a tu cuenta de {platform}",
      mockAccount: "@usuario_demo",
      mockAccountHint: "Cuenta autenticada en este navegador",
      permissionsTitle: "Permisos solicitados",
      permissions: {
        instagram: [
          "Ver tu perfil e información básica",
          "Leer tus publicaciones y reels públicos",
          "Acceder a métricas básicas (views, likes, comentarios)",
        ],
        tiktok: [
          "Ver tu perfil e información básica",
          "Leer tus videos públicos",
          "Acceder a estadísticas públicas de tus videos",
        ],
        facebook: [
          "Ver tu perfil e información básica",
          "Leer publicaciones públicas de tu página",
          "Acceder a insights básicos de tus publicaciones",
        ],
      },
      cancel: "Cancelar",
      authorize: "Autorizar",
      loading: {
        verifying: "Verificando permisos...",
        fetching: "Obteniendo datos de cuenta...",
        connecting: "Conectando con Licénciame...",
      },
    },
    success: {
      title: "¡{platform} conectado!",
      subtitleTemplate: "{username} · {displayName}",
      syncing: "Sincronizando tus publicaciones recientes...",
      syncDone: "✓ Sincronización completa. {count} publicaciones encontradas.",
      done: "Listo",
      goToDashboard: "Ir al dashboard",
      connectAnother: "Conectar otra red",
    },
    reconnect: {
      title: "Reconectar {platform}",
      body: "Tu autorización expiró el {date}. Para seguir midiendo, necesitamos que la renueves.",
      keep: "Se mantendrán las publicaciones y métricas ya registradas.",
      cancel: "Cancelar",
      cta: "Renovar autorización",
      toastSuccess: "✓ {platform} reconectado. Reanudando sincronización...",
    },
    permissionsDenied: {
      title: "No se completó la conexión con {platform}",
      body: "Sin esta conexión no podremos medir automáticamente el rendimiento de tu contenido en {platform} ni validar el uso de tus licencias.",
      lossesTitle: "Qué pierdes mientras no conectes",
      losses: [
        "Métricas automáticas por publicación",
        "Detección automática de uso de música licenciada",
        "Reportes consolidados por red social",
      ],
      retry: "Intentar de nuevo",
      dismiss: "Entendido, seguir sin conectar",
    },
    popupBlocked: {
      title: "Tu navegador bloqueó la ventana emergente",
      body: "Para conectar tu cuenta, necesitamos abrir una ventana de autorización. Permite ventanas emergentes de licenciame.com e intenta de nuevo.",
      instructionsTitle: "Cómo permitir ventanas emergentes",
      instructions: [
        "Chrome: haz click en el ícono 🔓 de la barra de direcciones → Permitir.",
        "Safari: ve a Ajustes → Sitios web → Ventanas emergentes → Permitir.",
        "Firefox: haz click en el aviso amarillo bajo la barra → Permitir.",
      ],
      retry: "Intentar de nuevo",
      close: "Cerrar",
    },
    accountTaken: {
      title: "Esta cuenta ya está vinculada",
      body: "La cuenta {username} ya está siendo usada por otra empresa en Licénciame. Una cuenta de red social solo puede conectarse a una empresa a la vez.",
      hints: [
        "Si esta cuenta es tuya y crees que hay un error, contáctanos a soporte@licenciame.com.",
        "Si la cuenta pertenece a otra empresa, pide que la desconecten primero.",
      ],
      contact: "Contactar soporte",
      close: "Cerrar",
      mailto: "mailto:soporte@licenciame.com?subject=Cuenta%20vinculada%20a%20otra%20empresa",
    },
  },
  manage: {
    title: "Cuentas de {platform}",
    subtitle: "Administra todas las cuentas de {platform} conectadas a tu empresa.",
    empty: "Aún no tienes cuentas de {platform} conectadas.",
    addAnother: "+ Añadir otra cuenta de {platform}",
    primaryLabel: "Cuenta principal",
    primaryHint: "Solo una cuenta por red puede ser la principal.",
    connectedAt: "Conectada hace {duration}",
    lastSync: "Última sincronización: hace {duration}",
    disconnect: "Desconectar",
    disconnectConfirmTitle: "¿Desconectar {username}?",
    disconnectConfirmBody:
      "Dejaremos de sincronizar las publicaciones de esta cuenta. Tus datos históricos se conservan según tu plan.",
    disconnectConfirmCta: "Sí, desconectar",
    disconnectConfirmCancel: "Cancelar",
    toastDisconnected: "Cuenta {username} desconectada.",
    toastPrimary: "{username} ahora es tu cuenta principal de {platform}.",
    multiSummary: "{username} +{count} cuenta más",
    multiSummaryPlural: "{username} +{count} cuentas más",
  },
  health: {
    healthy: "Conexión saludable · Última verificación hace {n}",
    unknown: "Conexión saludable · Verificación pendiente",
    error: "Problema detectado · Última verificación hace {n}",
    tooltip:
      "Verificamos tu conexión cada 6 horas. Si el token expira, te avisaremos por email y aquí.",
    toastDone: "Verificación de conexiones completada",
  },
  banner: {
    single: "1 de tus conexiones necesita atención",
    plural: "{count} de tus conexiones necesitan atención",
    cta: "Ver detalles",
    dismiss: "Cerrar aviso",
  },
  debug: {
    title: "Demo · Escenarios F-07",
    subtitle: "Activa escenarios para mostrar al cliente.",
    flags: {
      popupBlocked: "Simular popup bloqueado",
      accountTaken: "Simular cuenta ya vinculada (en flujo OAuth)",
      forceInstagramExpired: "Simular token expirado en Instagram",
      syncNetworkError: "Simular error de red al sincronizar",
      simulatePermissionsRevoked: "Simular permisos revocados en Facebook",
      simulateDuplicateAccount: "Simular cuenta duplicada en TikTok",
    },
    reset: "Reset a estado inicial",
    resetToast: "Estado de demo reiniciado.",
    open: "Abrir panel de demo (Shift+D)",
    close: "Cerrar panel de demo",
    shortcutHint: "Atajo: Shift + D",
  },
} as const;
