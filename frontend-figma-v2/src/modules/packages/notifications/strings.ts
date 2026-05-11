export const notificationsStrings = {
  page: {
    title: "Notificaciones",
    subtitle:
      "Alertas automáticas que el User Empresa recibe por email para eventos críticos de su cuenta, compras, licencias y vigencia de créditos.",
    rulesBadge: "Reglas fijas del sistema",
    bullets: [
      "Disparadas por reglas de negocio fijas",
      "Canal único: email transaccional",
      "No configurables por el usuario",
      "Banners in-app: recomendación UX pendiente de confirmación",
    ],
  },
  channelCard: {
    title: "Canal de notificaciones",
    recipientLabel: "Email de destino",
    statusLabel: "Estado",
    channelLabel: "Canal activo",
    verified: "Email verificado",
    channel: "Email transaccional",
    disclaimer:
      "Estas notificaciones son automáticas y no pueden desactivarse desde la cuenta.",
  },
  list: {
    title: "Notificaciones del sistema",
    subtitle: "Eventos que disparan un email transaccional al User Empresa.",
  },
  status: {
    sent: "Enviado",
    pending_rule: "Pendiente por regla",
    needs_definition: "Requiere definición",
  },
  actions: {
    viewEmail: "Ver email",
    viewEvent: "Ver detalle del evento",
    close: "Cerrar",
    reviewRecommendation: "Revisar recomendación",
  },
  emailPreview: {
    previewLabel: "Preview de email",
    subjectLabel: "Asunto",
    toLabel: "Para",
    fromLabel: "De",
    fromValue: "Licénciame · no-reply@licenciame.com",
    dateLabel: "Fecha",
    detailsLabel: "Resumen",
    attachmentLabel: "Adjunto",
    attachmentsLabel: "Adjuntos",
    brandFooter:
      "Licénciame · Email transaccional automático · No respondas a este correo.",
    sidePanel: {
      title: "Detalles de la notificación",
      statusLabel: "Estado",
      channelLabel: "Canal",
      typeLabel: "Tipo",
      configurableLabel: "Configurable por usuario",
      channelValue: "Email",
      typeValue: "Transaccional",
      configurableValue: "No",
    },
  },
  pendingRules: {
    title: "Reglas pendientes por definir",
    subtitle:
      "Estas reglas de negocio aún no tienen un valor técnico definido.",
    items: {
      lowBalance: {
        title: "Umbral de saldo bajo",
        description: "Pendiente de definición técnica.",
      },
      expiry: {
        title: "Anticipación de vencimiento",
        description: "Pendiente de definición técnica.",
      },
    },
  },
  risk: {
    title: "Riesgo operativo",
    description:
      "Si el email no llega o cae en spam, el usuario puede no enterarse de saldo bajo o vencimiento de bolsa.",
    modalTitle: "Recomendación UX",
    modalBody:
      "Considerar banners in-app como complemento visual al email para eventos críticos (saldo bajo, vencimiento de bolsa, licencia emitida).",
  },
} as const;
