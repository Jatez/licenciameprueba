/**
 * In-app product tour strings.
 * 4 steps: welcome modal + 3 spotlights (Explorar música / Créditos / Redes sociales).
 */
export const onboardingStrings = {
  welcome: {
    title: "Bienvenido a Licénciame",
    subtitle:
      "Te haremos un tour rápido (menos de un minuto) para que sepas por dónde empezar.",
    cta: "Empezar tour",
    skip: "Saltar tour",
    durationHint: "≈ 60 segundos · 3 paradas",
  },
  steps: {
    "explore-catalog": {
      label: "Explora el catálogo",
      title: "Encuentra la canción perfecta",
      description:
        "Filtra miles de canciones por mood, género o uso. Escucha previsualizaciones antes de licenciar.",
    },
    "buy-credits": {
      label: "Compra créditos",
      title: "Carga créditos en tu wallet",
      description:
        "Los créditos te permiten licenciar al instante. Elige el plan que mejor se ajuste a tu equipo.",
    },
    "connect-social": {
      label: "Conecta tus redes",
      title: "Conecta tus redes sociales",
      description:
        "Vincula Instagram, TikTok y YouTube para asociar licencias automáticamente a tus publicaciones.",
    },
  },
  navigation: {
    previous: "Atrás",
    next: "Siguiente",
    finish: "Finalizar tour",
    skip: "Saltar",
    close: "Cerrar tour",
    stepLabel: "Paso {current} de {total}",
  },
  paused: {
    title: "Tour en pausa",
    description: "Continúa cuando quieras desde tu avatar.",
    resume: "Retomar tour",
  },
  completion: {
    title: "¡Listo!",
    description: "Ya conoces lo esencial. Puedes volver a ver el tour cuando quieras.",
  },
  reengage: {
    label: "Volver a ver el tour",
  },
  emptyStates: {
    wallet: {
      title: "Aún no tienes créditos",
      description:
        "Compra tu primera bolsa de créditos para empezar a licenciar música al instante.",
      cta: "Comprar créditos",
    },
    licenses: {
      title: "Sin licencias todavía",
      description:
        "Aún no has licenciado ninguna canción. Explora el catálogo y licencia tu primera.",
      cta: "Explorar catálogo",
    },
    social: {
      title: "Conecta tus redes sociales",
      description:
        "Vincula tus cuentas para hacer tracking automático de tus publicaciones.",
      cta: "Conectar redes",
    },
    metrics: {
      title: "Sin métricas aún",
      description:
        "Las métricas aparecerán cuando empieces a publicar contenido con música licenciada.",
    },
  },
} as const;
