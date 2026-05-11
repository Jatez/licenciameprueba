/**
 * F-09 Admin Plataforma — UI strings (Spanish only, code in English).
 * MOCK ONLY — no backend wiring.
 */
export const adminStrings = {
  brand: {
    productName: "Licénciame",
    consoleName: "Plataforma",
  },
  nav: {
    sectionMain: "Operación",
    sectionSystem: "Sistema",
    overview: "Overview",
    catalog: "Catálogo",
    companies: "Empresas",
    pricing: "Paquetes y precios",
    licenses: "Licencias",
    billing: "Pagos y facturación",
    audit: "Auditoría",
    access: "Accesos y usuarios",
    backToApp: "Volver al dashboard",
  },
  user: {
    roleLabel: "Super Admin",
  },
  guard: {
    title: "Acceso restringido",
    description: "Esta sección está disponible solo para Super Admin.",
    ctaLogin: "Iniciar sesión como Super Admin",
    ctaHome: "Volver al inicio",
    note: "Demo · El control de acceso real se conecta cuando exista backend.",
  },
  overview: {
    pageTitle: "Panel Super Admin",
    pageSubtitle:
      "Controla la operación global de Licénciame: catálogo, empresas, créditos, licencias, pagos y auditoría.",
    metricsHeading: "Resumen global",
    metricsHint: "Últimos 30 días · Datos simulados",
    alertsHeading: "Alertas que requieren atención",
    alertsHint: "Eventos operativos, legales y financieros que necesitan revisión.",
    quickActionsHeading: "Accesos rápidos",
    quickActionsHint: "Atajos a las acciones más frecuentes del equipo de plataforma.",
    badgeDemo: "Demo",
  },
  metrics: {
    activeCompanies: {
      label: "Empresas activas",
      caption: "Organizaciones con acceso vigente a la plataforma.",
    },
    creditsSold: {
      label: "Créditos vendidos",
      caption: "Total de créditos adquiridos por empresas.",
    },
    licensesIssued: {
      label: "Licencias emitidas",
      caption: "Licencias generadas desde el catálogo aprobado.",
    },
    revenue: {
      label: "Ingresos generados",
      caption: "Valor acumulado de compras registradas.",
    },
    catalogTracks: {
      label: "Tracks en catálogo",
      caption: "Música disponible para licenciamiento empresarial.",
    },
    hiddenTracks: {
      label: "Tracks ocultos / en revisión",
      caption: "Tracks no visibles para empresas mientras se revisan.",
    },
    pendingPayments: {
      label: "Pagos pendientes",
      caption: "Compras a la espera de conciliación contable.",
    },
    legalAlerts: {
      label: "Alertas legales",
      caption: "Tracks o licencias que requieren revisión.",
    },
  },
  alerts: {
    severity: {
      legal: "Legal",
      ops: "Operación",
      finance: "Finanzas",
      catalog: "Catálogo",
    },
    cta: "Revisar",
    items: {
      trackWithLicenses: {
        title: "Track con licencias activas marcado para eliminación",
        body: "No se recomienda eliminar tracks con licencias activas. Usa soft delete para preservar evidencia legal.",
      },
      companySuspension: {
        title: "Empresa con créditos activos en cola de suspensión",
        body: "Revisa el saldo activo antes de suspender el acceso.",
      },
      catalogStale: {
        title: "Catálogo sin actualización reciente",
        body: "Última actualización del catálogo: hace 18 días.",
      },
      pendingReconciliation: {
        title: "Pagos pendientes de conciliación",
        body: "Hay facturas pendientes por revisar.",
      },
    },
  },
  quickActions: {
    addTrack: { title: "Agregar track", caption: "Sube una pieza al catálogo administrado." },
    importCsv: { title: "Importar catálogo CSV", caption: "Carga masiva de metadatos." },
    createPackage: { title: "Crear paquete de créditos", caption: "Define precio y vigencia." },
    viewCompanies: { title: "Ver empresas", caption: "Listado de organizaciones cliente." },
    reviewLicenses: { title: "Revisar licencias", caption: "Licencias emitidas y vigentes." },
    auditActivity: { title: "Auditar actividad", caption: "Bitácora de cambios sensibles." },
    toastComingSoon: "Acción demo: pendiente de conexión con backend.",
  },
  placeholders: {
    catalog: {
      title: "Catálogo administrado",
      description:
        "Gestión de tracks, estados (publicado, oculto, en revisión), metadatos y carga masiva.",
    },
    companies: {
      title: "Empresas",
      description:
        "Listado, detalle, suspensión y reasignación de planes de las organizaciones cliente.",
    },
    pricing: {
      title: "Paquetes y precios",
      description: "Definición de packs de créditos, vigencias, descuentos y promociones.",
    },
    licenses: {
      title: "Licencias",
      description: "Búsqueda y revisión de licencias emitidas, vigencias y evidencias.",
    },
    billing: {
      title: "Pagos y facturación",
      description: "Conciliación de pagos, facturas, notas crédito y métricas financieras.",
    },
    audit: {
      title: "Auditoría",
      description: "Bitácora cronológica de acciones administrativas sensibles.",
    },
    access: {
      title: "Accesos y usuarios",
      description: "Roles internos, invitaciones y permisos del equipo Licénciame.",
    },
    soon: "Próximamente",
    note: "Este módulo se construye en el siguiente prompt. La estructura, layout y navegación ya están listas.",
  },
} as const;
