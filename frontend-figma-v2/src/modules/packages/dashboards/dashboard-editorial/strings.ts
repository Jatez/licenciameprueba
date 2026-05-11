/**
 * Spanish UI copy for the editorial dashboard exploration.
 * All user-facing text lives here so identifiers stay in English.
 */
export const editorialStrings = {
  header: {
    greeting: "Buenas tardes, María",
    subtitle:
      "Esto es lo que pasó en Discos Fuentes esta semana — del 19 al 25 de marzo de 2026.",
    period: "Últimos 7 días",
    exportCta: "Exportar",
  },
  hero: {
    label: "Tu billetera hoy",
    available: "créditos de 600 disponibles",
    expiry: "Tu Bolsa B vence el 10 de diciembre de 2026 — quedan 8 meses",
    primaryCta: "Comprar más créditos",
    secondaryCta: "Ver historial",
    consumedLabel: "30% consumido este mes",
    consumed: "Consumiste 180 créditos",
    licensesIssued: "En 19 licencias",
    average: "Promedio: 9.5 cr/licencia",
  },
  kpis: {
    activeLicensesLabel: "Licencias vigentes",
    activeLicensesDelta: "↑ 4 emitidas esta semana",
    publicationsLabel: "Publicaciones registradas",
    favoritesLabel: "Tracks en favoritos",
    favoritesDelta: "↑ 6 nuevos esta semana",
  },
  topTracks: {
    title: "Lo que más sonó esta semana",
    subtitle: "Tus canciones más licenciadas del período",
    seeAll: "Ver todo",
    prevAria: "Track anterior",
    nextAria: "Siguiente track",
  },
  consumption: {
    title: "Cómo usas tus créditos",
    insightLabel: "El que más pesa",
    insightHeading: "30 créditos",
    insightCopy:
      "Video largo es tu tipo de uso más costoso — representa el 27% del consumo.",
    insightNote:
      "Considera usar paquete stories para campañas cortas y reservar video largo para hitos.",
  },
  payments: {
    title: "Pagos recientes",
    seeAll: "Ver historial completo",
    paid: "Pagado",
    pending: "Pendiente",
    downloadInvoice: "Descargar factura",
  },
  footer: {
    lastUpdate: "Última actualización: hace 3 minutos",
    refresh: "Refrescar",
  },
} as const;
